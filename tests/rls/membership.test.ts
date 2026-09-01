import { describe, expect, it } from "vitest";
import { anonClient, freshUser, memberClient, serviceClient, SEED } from "./helpers";

/**
 * Membership is gated by invites at the database layer. An authenticated
 * account with no redeemed invite is not a member and cannot make itself one.
 */
describe("invite-gated membership", () => {
  it("an authed user without a redeemed invite cannot create a profile", async () => {
    const { client, id } = await freshUser();
    const { error } = await client.from("profiles").insert({
      id,
      display_name: "Gate Crasher",
      invited_by: SEED.maya.id,
    });
    expect(error).not.toBeNull();
  });

  it("check_invite_code validates without exposing the invites table", async () => {
    const anon = anonClient();
    const { data: valid } = await anon.rpc("check_invite_code", {
      invite_code: SEED.openInviteFromMaya,
    });
    const row = Array.isArray(valid) ? valid[0] : valid;
    expect(row?.valid).toBe(true);
    expect(row?.inviter_name).toBe("Maya Tan");

    const { data: invalid } = await anon.rpc("check_invite_code", {
      invite_code: "TV-NOTACODE1",
    });
    expect(Array.isArray(invalid) ? invalid : [invalid].filter(Boolean)).toHaveLength(0);
  });

  it("redeeming a revoked invite fails", async () => {
    // Maya creates then revokes an invite; a newcomer cannot use it.
    const maya = await memberClient(SEED.maya.email);
    const { data: invite } = await maya
      .from("invites")
      .insert({ inviter_id: SEED.maya.id })
      .select("id, code")
      .single();
    expect(invite).not.toBeNull();
    await maya
      .from("invites")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", invite!.id);

    const { client } = await freshUser();
    const { error } = await client.rpc("redeem_invite", {
      invite_code: invite!.code,
    });
    expect(error).not.toBeNull();
  });

  it("full join: redeem, profile with matching inviter, auto-connection, visible chain", async () => {
    // Priya issues a real invite; a newcomer redeems it and joins.
    const priya = await memberClient(SEED.priya.email);
    const { data: invite } = await priya
      .from("invites")
      .insert({ inviter_id: SEED.priya.id })
      .select("id, code")
      .single();

    const { client, id } = await freshUser();
    const { error: redeemError } = await client.rpc("redeem_invite", {
      invite_code: invite!.code,
    });
    expect(redeemError).toBeNull();

    // Lying about the inviter is rejected by the insert policy.
    const { error: lieError } = await client.from("profiles").insert({
      id,
      display_name: "Impostor",
      invited_by: SEED.maya.id,
    });
    expect(lieError).not.toBeNull();

    // The honest insert succeeds.
    const { error: insertError } = await client.from("profiles").insert({
      id,
      display_name: "New Member",
      invited_by: SEED.priya.id,
    });
    expect(insertError).toBeNull();

    // The trigger connected newcomer and inviter.
    const { data: conns } = await client.from("connections").select("*");
    expect(conns).toHaveLength(1);

    // The chain is immutable: invited_by cannot be rewritten.
    const { data: after } = await client
      .from("profiles")
      .update({ invited_by: SEED.maya.id })
      .eq("id", id)
      .select("invited_by");
    expect(after ?? []).toHaveLength(0); // trigger raises; no row comes back

    const { data: check } = await serviceClient()
      .from("profiles")
      .select("invited_by")
      .eq("id", id)
      .single();
    expect(check!.invited_by).toBe(SEED.priya.id);
  });

  it("a used invite code cannot be redeemed twice", async () => {
    const maya = await memberClient(SEED.maya.email);
    const { data: invite } = await maya
      .from("invites")
      .insert({ inviter_id: SEED.maya.id })
      .select("code")
      .single();

    const first = await freshUser();
    const { error: firstError } = await first.client.rpc("redeem_invite", {
      invite_code: invite!.code,
    });
    expect(firstError).toBeNull();

    const second = await freshUser();
    const { error: secondError } = await second.client.rpc("redeem_invite", {
      invite_code: invite!.code,
    });
    expect(secondError).not.toBeNull();
  });
});
