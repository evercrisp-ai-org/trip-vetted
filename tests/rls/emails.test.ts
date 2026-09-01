import { describe, expect, it } from "vitest";
import { anonClient, memberClient, serviceClient, SEED } from "./helpers";

/**
 * "Emails are never exposed. Enforced at the database layer, not in the UI."
 * (BUILD-SPEC section 2, rule 3.) These tests prove the enforcement.
 */
describe("email exposure", () => {
  it("profiles carry no email column at all", async () => {
    const maya = await memberClient(SEED.maya.email);
    const { data } = await maya.from("profiles").select("*").limit(1);
    expect(data).not.toBeNull();
    expect(data![0]).not.toHaveProperty("email");
  });

  it("the waitlist accepts anonymous inserts", async () => {
    const anon = anonClient();
    const email = `waitlist-${crypto.randomUUID()}@test.tripvetted.local`;
    const { error } = await anon.from("waitlist_signups").insert({ email });
    expect(error).toBeNull();
  });

  it("no client role can read the waitlist back, even though rows exist", async () => {
    const email = `waitlist-${crypto.randomUUID()}@test.tripvetted.local`;
    await anonClient().from("waitlist_signups").insert({ email });

    // The row is really there (service role sees it) ...
    const { data: adminRows } = await serviceClient()
      .from("waitlist_signups")
      .select("email")
      .eq("email", email);
    expect(adminRows).toHaveLength(1);

    // ... but neither anonymous visitors nor signed-in members can read it.
    const { data: anonRows } = await anonClient()
      .from("waitlist_signups")
      .select("email")
      .eq("email", email);
    expect(anonRows ?? []).toHaveLength(0);

    const maya = await memberClient(SEED.maya.email);
    const { data: memberRows } = await maya
      .from("waitlist_signups")
      .select("email")
      .eq("email", email);
    expect(memberRows ?? []).toHaveLength(0);
  });

  it("members cannot read other members' invites (codes and email hashes stay private)", async () => {
    // TV-DEMOFRIEND is Maya's open invite. Jonah must not see it.
    const jonah = await memberClient(SEED.jonah.email);
    const { data } = await jonah
      .from("invites")
      .select("code, email_hash")
      .eq("code", SEED.openInviteFromMaya);
    expect(data ?? []).toHaveLength(0);

    // Maya sees her own.
    const maya = await memberClient(SEED.maya.email);
    const { data: own } = await maya
      .from("invites")
      .select("code")
      .eq("code", SEED.openInviteFromMaya);
    expect(own).toHaveLength(1);
  });

  it("anonymous visitors cannot enumerate invites", async () => {
    const { data } = await anonClient().from("invites").select("code");
    expect(data ?? []).toHaveLength(0);
  });
});
