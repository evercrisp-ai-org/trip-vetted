/**
 * Every user-facing word in Trip Vetted lives in this file.
 *
 * To change copy anywhere on the site or in the app, edit the text between
 * quotes below and save. No other file needs to change. Keys are named for
 * where the text appears.
 */

export const site = {
  name: "Trip Vetted",
  tagline: "Real Experiences. Trusted Advice.",
  description:
    "Travel advice from people who know you, not ten thousand strangers.",
};

export const nav = {
  howItWorks: "How it works",
  privacy: "Privacy",
  memberSignIn: "Member sign in",
  haveAnInvite: "I have an invite",
};

export const hero = {
  kicker: "Invite-only travel network",
  headline: "Travel advice from people who know you,",
  headlineEmphasis: "not ten thousand strangers.",
  sub: "Trip Vetted is a private circle where every recommendation is signed by a friend who was actually there. No review scores from the crowd. No listicles. Just your people, and where they would send you.",
  primaryCta: "Join the waitlist",
  secondaryCta: "I have an invite code",
};

export const circle = {
  kicker: "Your travel circle",
  headline: "Five friends who travel well beat five thousand reviews.",
  body: "You already trust certain people about where to eat and where to stay. Trip Vetted makes that trust usable. Your circle is built one invitation at a time, and you can always see who brought anyone in. If a tip shows up in your plans, you know exactly whose taste it reflects.",
  points: [
    {
      title: "Invited, never scraped",
      body: "There is no public signup. Every member was invited by someone, and the chain of invitations is visible on every profile.",
    },
    {
      title: "People, not profiles",
      body: "A recommendation here carries a name and a face you recognize. You can text the person who wrote it.",
    },
    {
      title: "Taste that matches yours",
      body: "Members tag what they care about: street food, small hotels, long walks. Advice gets filtered to how you actually travel.",
    },
  ],
};

export const howItWorks = {
  kicker: "How it works",
  headline: "Document. Stamp. Share.",
  steps: [
    {
      name: "Document",
      title: "Log the trip while it is fresh",
      body: "After a trip, write down what you loved and what you would skip. Add photos, dates, and the places that mattered. Three fields and you are done.",
    },
    {
      name: "Stamp",
      title: "Your passport fills up",
      body: "Each trip becomes a stamp: a dated, signed record in your travel passport. Your stamps are yours. You choose who sees each one.",
    },
    {
      name: "Share",
      title: "Your circle plans with your stamps",
      body: "When a friend plans a trip somewhere you have been, your stamp is what guides them. One friend covers the food, another the neighborhoods, and the trip rounds out.",
    },
  ],
};

export const stampsAndBriefs = {
  kicker: "Stamps and trip briefs",
  headline: "One bit from one friend, a little from another.",
  body: "Planning a trip assembles a brief from the stamps of people in your circle who have been there, matched to your tastes. Every line in the brief names the friend it came from. If nobody in your circle has been where you are going, the brief says so, plainly, instead of padding the gap with search results.",
  stampCardLabel: "A stamp, roughly",
  exampleStamp: {
    place: "Kyoto, Japan",
    coords: "35.0116 N, 135.7681 E",
    dates: "NOV 10 TO NOV 14, 2025",
    author: "Priya N.",
    loved: "Fushimi Inari before sunrise, completely empty. Tea at Ippodo.",
    avoided: "The bamboo grove at midday. Shoulder to shoulder.",
    lovedLabel: "Loved",
    avoidedLabel: "Skip",
  },
  briefNote:
    "Every line in a brief is cited back to the stamp it came from. Nothing is invented to fill space.",
};

export const privacy = {
  kicker: "Privacy and trust",
  headline: "Built private, because it has to be.",
  points: [
    {
      title: "Your email is never shown",
      body: "Not to members, not on profiles, not anywhere. This is enforced in the database itself, not just hidden in the interface.",
    },
    {
      title: "You control every stamp",
      body: "Each stamp is private, visible to your circle, or visible to the community. You decide per stamp, and you can change your mind.",
    },
    {
      title: "The chain is public inside the walls",
      body: "Who invited whom is visible to members. That is the point: accountability is what makes the advice worth taking.",
    },
    {
      title: "No ads, no data resale",
      body: "The product is the network, not your attention. Nothing here is sold to anyone.",
    },
  ],
};

export const waitlist = {
  headline: "No invite yet?",
  body: "Leave your email. When your corner of the network opens up, or a member vouches for you, this is how we reach you.",
  placeholder: "you@example.com",
  button: "Join the waitlist",
  success: "You are on the list. We only email when there is something real.",
  invalid: "That does not look like an email address.",
  error: "Something went wrong on our side. Try once more.",
};

export const footer = {
  blurb: "An invite-only travel network. Every recommendation signed by someone you know.",
  colProduct: "Product",
  colTrust: "Trust",
  linkHowItWorks: "How it works",
  linkStamps: "Stamps and briefs",
  linkPrivacy: "Privacy",
  linkSignIn: "Member sign in",
  fineprint: "Members join by invitation. The waitlist is the queue for the door.",
};

/* ------------------------------------------------------------------ */
/* App: joining, signing in, onboarding                                */
/* ------------------------------------------------------------------ */

export const join = {
  title: "Redeem your invite",
  sub: "Someone vouched for you. Enter the code they sent.",
  codeLabel: "Invite code",
  codePlaceholder: "TV-XXXXXXXX",
  codeButton: "Check code",
  codeInvalid: "That code is not valid. It may have been used or revoked. Ask your inviter for a fresh one.",
  invitedByPrefix: "Invited by",
  emailLabel: "Your email",
  emailSub: "We send a sign-in link. No password to remember.",
  emailButton: "Send my sign-in link",
  emailSent: "Check your email. The link signs you in and starts onboarding.",
  emailInvalid: "That does not look like an email address.",
  genericError: "Something went wrong. Try again.",
};

export const login = {
  title: "Member sign in",
  sub: "Enter the email you joined with. We send a one-time link.",
  emailLabel: "Email",
  button: "Send sign-in link",
  sent: "Check your email for the sign-in link.",
  notMember: "Not a member yet?",
  notMemberLink: "Redeem an invite",
  genericError: "Something went wrong. Try again.",
};

export const authErrors = {
  linkExpired: "That sign-in link is expired or already used. Request a new one.",
  tryAgain: "Back to sign in",
};

export const onboarding = {
  title: "Set up your page",
  sub: "This is how your circle sees you.",
  needCode: "Enter the invite code you were sent to finish joining.",
  codeLabel: "Invite code",
  nameLabel: "Display name",
  namePlaceholder: "How your friends know you",
  cityLabel: "Home city",
  cityPlaceholder: "Where you are based",
  tagsLabel: "Taste tags",
  tagsSub: "A few words for how you travel. Comma separated: street-food, museums, small-hotels.",
  tagsPlaceholder: "street-food, long-walks, dive-bars",
  avatarLabel: "Photo",
  avatarSub: "Optional. A square image works best.",
  bioLabel: "A line about you",
  bioPlaceholder: "Optional",
  button: "Enter Trip Vetted",
  errors: {
    nameRequired: "A display name is required.",
    codeRequired: "An invite code is required to join.",
    codeInvalid: "That invite code is not valid or was already used.",
    generic: "Could not finish setup. Try again.",
  },
};

export const home = {
  welcomePrefix: "Welcome,",
  circleTitle: "Your circle",
  circleEmpty: "Your circle is just you and your inviter so far. Invite someone whose taste you trust.",
  invitesTitle: "Your invites",
  invitesSub: "Each code admits one person. You will be shown as their inviter, permanently.",
  newInviteButton: "Create an invite code",
  inviteOpen: "Open",
  inviteAccepted: "Accepted",
  inviteRevoked: "Revoked",
  revokeButton: "Revoke",
  copyButton: "Copy",
  copiedNote: "Copied",
  viewProfile: "View page",
  signOut: "Sign out",
  memberSincePrefix: "Member since",
};

export const profilePage = {
  invitedByPrefix: "Invited by",
  foundingMember: "Founding member",
  invitedListTitle: "Has invited",
  invitedNobody: "Nobody yet.",
  homeCityLabel: "Home base",
  tagsLabel: "Travels for",
  memberSincePrefix: "Member since",
  backToCircle: "Back to your circle",
};

export const chrome = {
  skipToContent: "Skip to content",
};
