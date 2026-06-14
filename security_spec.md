# YouTube Exchange Firestore Security Specification

This document defines the data integrity invariants and security assertions for our Zero-Trust Firestore database structure.

## 1. Data Invariants

1. **User Profiles (`users/{userId}`)**:
   - `uid` must match the document ID.
   - Any write must be authenticated as that specific user (`request.auth.uid == userId`).
   - Normal users are prevented from self-assigning excess points unless verified by administrative actions (TBD updates).
   - Only administrative override or the system itself can edit point balances directly without transactions, or we lock the points field to prevent raw client spoofing updates (Tiered Identity Logic).

2. **Campaign Documents (`campaigns/{campaignId}`)**:
   - Creating a campaign requires a valid owner matching `request.auth.uid`.
   - Creation of campaigns requires verifying that the user has enough points (`get(/databases/$(database)/documents/users/$(request.auth.uid)).data.points >= totalCost`).
   - The user cannot modify critical campaign fields (like `pointsPerAction`, `rewardPerAction`, `creatorId`, `youtubeUrl`) once created. They can only toggle `status` (Action: Toggle Status).
   - `completedCount` can only be updated synchronously when verifying actions or by standard administrator actions.

3. **Action Logs (`history/{historyId}`)**:
   - Format: `historyId` must be composed of `userId_campaignId` to prevent race conditions or duplicate submissions.
   - The logging user must match `userId`.
   - Deleting history is forbidden.
   - Creating an interaction log requires that the user also increments the corresponding campaign's `completedCount` in the same batch (Relational Atomicity).

4. **Deposits / Payments (`payments/{paymentId}`)**:
   - Create is allowed for any signed-in user, but they must set `status: 'pending'`.
   - Modifying `status` to `approved` or `rejected` is strictly reserved for the Administrator.

5. **Settings (`settings/{settingsId}`)**:
   - Read is public or allowed for all signed-in users.
   - Modify is strictly limited to the Administrator.

---

## 2. The "Dirty Dozen" Vandalism Payloads (Abuse Attempts)

| Payload ID | Target Path | Actor | Action | Payload Shape / Intent | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `users/alice` | Bob | Write | Bob tries to edit Alice's profile points | **PERMISSION_DENIED** |
| **02** | `users/alice` | Alice | Update | Alice tries to grant herself 9,000,000 points directly | **PERMISSION_DENIED** |
| **03** | `campaigns/camp_1` | Bob | Update | Bob tries to edit the YouTube URL or title of Ahmed's campaign | **PERMISSION_DENIED** |
| **04** | `campaigns/camp_1` | Ahmed | Update | Ahmed tries to reduce the reward points of a running campaign while active | **PERMISSION_DENIED** |
| **05** | `history/bob_camp_1` | Bob | Create | Bob tries to log that he earned 1,000,000 points for a 50 point campaign | **PERMISSION_DENIED** |
| **06** | `history/bob_camp_1` | Bob | Create | Bob tries to create history with `userId: 'alice'` | **PERMISSION_DENIED** |
| **07** | `payments/pay_abc` | Bob | Create | Bob submits purchase with status forced to `approved` | **PERMISSION_DENIED** |
| **08** | `payments/pay_abc` | Bob | Update | Bob tries to self-approve his own pending purchase of points | **PERMISSION_DENIED** |
| **09** | `settings/admin` | Bob | Update | Bob tries to update the admin cryptocurrency wallets to his own addresses | **PERMISSION_DENIED** |
| **10** | `campaigns/camp_abc` | Alice | Create | Alice tries to create a campaign with negative or zero quantity | **PERMISSION_DENIED** |
| **11** | `users/alice` | Alice | Delete | Alice tries to delete her user profile to avoid payment history | **PERMISSION_DENIED** |
| **12** | `history/bob_camp_1` | Bob | Delete | Bob tries to delete his history log to repeat a rewarded task | **PERMISSION_DENIED** |
