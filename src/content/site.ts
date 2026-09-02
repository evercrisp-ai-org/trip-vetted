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
  stamps: "Stamps",
  haveAnInvite: "I have an invite",
};

export const hero = {
  kicker: "Invite-only travel network",
  image: "nyc-broadway-rain.jpg",
  imageAlt:
    "A wide Manhattan avenue in the rain, wet asphalt reflecting traffic lights, people crossing under umbrellas",
  /* Three lines, set deliberately. The break is part of the composition,
     so edit the lines rather than reflowing one long string. */
  lines: ["Travel advice", "from people", "who know you."],
  sub: "Trip Vetted is a private circle where every recommendation is signed by a friend who was actually there. No review scores from the crowd. No listicles. Just your people, and where they would send you.",
  primaryCta: "Join the waitlist",
  secondaryCta: "I have an invite code",
  scrollCue: "See how it works",
};

export const circle = {
  image: "nyc-umbrellas.jpg",
  kicker: "Your travel circle",
  imageAlt:
    "A crowd crossing a rainy city street under black umbrellas",
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

export const stampArc = {
  kicker: "From the passport",
  headline: "Every photograph here is somebody's stamp.",
  sub: "Not stock photography. Real frames from real trips, each one signed and dated by the member who took it.",
  railLabel: "Recent stamps from the network",
  /*
   * `arc` is the vertical offset that makes the row read as a curve, applied
   * from lg up only (see .arc in globals.css). Keep the sequence symmetric:
   * out, down, deepest, deepest, down, out.
   *
   * `position` is the object-position for this frame. These are real
   * photographs at their own crops, so each one names the part that has to
   * survive being cut to 4:5. Adjust here, never by re-exporting the file.
   */
  items: [
    {
      place: "Tokyo",
      region: "Japan",
      note: "Jonah, vending machines at one in the morning",
      image: "tokyo-vending-night.jpg",
      alt: "Lit drink vending machines on a quiet Tokyo street corner at night",
      position: "45% 62%",
      arc: "0px",
    },
    {
      place: "Yokohama",
      region: "Japan",
      note: "Priya, the lantern street on a cold night",
      image: "yokohama-chinatown.jpg",
      alt: "A Chinatown street at night strung with red paper lanterns and shop signs",
      position: "50% 45%",
      arc: "52px",
    },
    {
      place: "Bangkok",
      region: "Thailand",
      note: "Sam, a print stall deep in the market",
      image: "bangkok-popart-market.jpg",
      alt: "A market stall with a wall of brightly coloured pop-art prints",
      position: "42% 50%",
      arc: "88px",
    },
    {
      place: "Bangkok",
      region: "Thailand",
      note: "Maya, painted shutters on a side street",
      image: "bangkok-striped-wall.jpg",
      alt: "A shopfront painted in orange and white checks and stripes beside a blue shutter",
      position: "80% 58%",
      arc: "88px",
    },
    {
      place: "New York",
      region: "USA",
      note: "Jonah, the corner shop that never closes",
      image: "nyc-bodega.jpg",
      alt: "The counter of a densely stocked corner shop, shelves crowded to the ceiling",
      position: "44% 44%",
      arc: "52px",
    },
    {
      place: "New York",
      region: "USA",
      note: "Priya, the green wall on the walk to lunch",
      image: "nyc-graffiti-wall.jpg",
      alt: "A green wall covered in white graffiti tags and pasted posters",
      position: "60% 62%",
      arc: "0px",
    },
  ],
};

export const askTheHub = {
  kicker: "Ask the hub",
  headline: "Ask your circle. Get real answers.",
  body: "Post a question to the people in your network. The ones who have been there answer, and every answer carries a name and a photograph. No sponsored listings. No ranked results. Nobody you have never met.",
  questionLabel: "Asked in the hub",
  question: "Two days in Delhi. Where do I actually eat?",
  answers: [
    {
      image: "food-thali.jpg",
      alt: "An overhead spread of curries, rice, naan and pickles in wooden bowls",
      who: "Priya N.",
      body: "Dal and paneer at the place with no sign, two streets back from the main road. Order the naan last so it arrives hot.",
    },
    {
      image: "food-biryani.jpg",
      alt: "A dark plate of biryani with naan, a copper bowl of curry and whole spices",
      who: "Jonah R.",
      body: "Biryani at lunch, never dinner. It sells out by two and the afternoon batch is not the same thing.",
    },
    {
      image: "food-rasmalai.jpg",
      alt: "Rasmalai in a steel dish, saffron and pistachio scattered over cream",
      who: "Maya T.",
      body: "Skip dessert where you eat. Walk to the sweet shop on the corner and have rasmalai cold, standing up.",
    },
  ],
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
  imageAlt: "A dark coastline at night with a lighthouse beam over the water",
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
