import { describe, expect, it } from "vitest";
import { anonClient, memberClient, SEED } from "./helpers";

/**
 * Stamp visibility. The product promise: private stamps never leave their
 * author, network stamps reach only the author's connections, community
 * stamps reach every member. Connections in seed: Maya-Jonah, Maya-Priya,
 * Jonah-Sam. Priya and Jonah are NOT connected. Maya and Sam are NOT
 * connected.
 */
describe("stamps RLS", () => {
  it("author reads their own private stamp", async () => {
    const sam = await memberClient(SEED.sam.email);
    const { data } = await sam
      .from("stamps")
      .select("id, headline")
      .eq("id", SEED.stamps.samOaxacaPrivate);
    expect(data).toHaveLength(1);
  });

  it("a directly connected member cannot read someone's private stamp", async () => {
    // Jonah invited Sam; they are connected. Private still means private.
    const jonah = await memberClient(SEED.jonah.email);
    const { data, error } = await jonah
      .from("stamps")
      .select("id")
      .eq("id", SEED.stamps.samOaxacaPrivate);
    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });

  it("an unconnected member cannot read a private stamp either", async () => {
    const maya = await memberClient(SEED.maya.email);
    const { data } = await maya
      .from("stamps")
      .select("id")
      .eq("id", SEED.stamps.samOaxacaPrivate);
    expect(data).toHaveLength(0);
  });

  it("network stamps are visible to the author's connections", async () => {
    const maya = await memberClient(SEED.maya.email); // connected to Jonah
    const { data } = await maya
      .from("stamps")
      .select("id")
      .eq("id", SEED.stamps.jonahTokyoNetwork);
    expect(data).toHaveLength(1);
  });

  it("network stamps are invisible outside the author's connections", async () => {
    const priya = await memberClient(SEED.priya.email); // NOT connected to Jonah
    const { data } = await priya
      .from("stamps")
      .select("id")
      .eq("id", SEED.stamps.jonahTokyoNetwork);
    expect(data).toHaveLength(0);
  });

  it("community stamps are visible to unconnected members", async () => {
    const sam = await memberClient(SEED.sam.email); // NOT connected to Maya
    const { data } = await sam
      .from("stamps")
      .select("id")
      .eq("id", SEED.stamps.mayaLisbonCommunity);
    expect(data).toHaveLength(1);
  });

  it("anonymous visitors read no stamps at all", async () => {
    const anon = anonClient();
    const { data } = await anon.from("stamps").select("id");
    expect(data ?? []).toHaveLength(0);
  });

  it("a member cannot write a stamp as someone else", async () => {
    const priya = await memberClient(SEED.priya.email);
    const { error } = await priya.from("stamps").insert({
      author_id: SEED.maya.id,
      place_id: "bbbbbbbb-0000-4000-8000-000000000001",
      headline: "forged stamp",
    });
    expect(error).not.toBeNull();
  });
});
