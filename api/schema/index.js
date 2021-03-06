const { gql } = require('apollo-server-micro');

const schema = gql`
  type Query {
    currentMember: Member
    events: [Event!]
    event(slug: String!): Event
    dream(eventId: ID!, slug: String!): Dream
    dreams(eventId: ID!): [Dream]
    members: [Member]
  }

  type Mutation {
    createEvent(
      adminEmail: String!
      slug: String!
      title: String!
      currency: String!
      description: String
      registrationPolicy: RegistrationPolicy!
    ): Event!
    editEvent(
      slug: String
      title: String
      registrationPolicy: RegistrationPolicy
    ): Event!

    createDream(
      eventId: ID!
      title: String!
      slug: String!
      description: String
      summary: String
      minGoal: Int
      maxGoal: Int
      images: [ImageInput]
    ): Dream
    editDream(
      dreamId: ID!
      title: String
      slug: String
      description: String
      summary: String
      minGoal: Int
      maxGoal: Int
      images: [ImageInput]
    ): Dream

    sendMagicLink(email: String!, eventId: ID!): Boolean
    updateProfile(name: String, avatar: String): Member
    inviteMembers(emails: String!): [Member]
    updateMember(memberId: ID!, isApproved: Boolean, isAdmin: Boolean): Member
    deleteMember(memberId: ID!): Member

    approveForGranting(dreamId: ID!, approved: Boolean!): Dream
    updateGrantingSettings(
      currency: String
      grantsPerMember: Int
      totalBudget: Int
      grantValue: Int
      grantingOpens: Date
      grantingCloses: Date
      dreamCreationCloses: Date
    ): Event
    giveGrant(dreamId: ID!, value: Int!): Grant
    deleteGrant(grantId: ID!): Grant
    reclaimGrants(dreamId: ID!): Dream
    preOrPostFund(dreamId: ID!, value: Int!): Grant
  }

  type Event {
    id: ID!
    slug: String!
    title: String!
    description: String
    # logo: String
    members: [Member!]!
    numberOfApprovedMembers: Int
    dreams: [Dream!]
    # flags: [Flag!]
    # questions: [Question!]
    # reactions: [Emoji] #requried or not? ui implications?
    # visibility: Visibility
    registrationPolicy: RegistrationPolicy!
    # grantingPeriods: [GrantingPeriod]
    currency: String! # scalar? # can't change after first submission closes
    # useGrantlings: Boolean! # can't change after first submission close
    totalBudget: Int
    totalBudgetGrants: Int
    remainingGrants: Int
    grantValue: Int
    grantsPerMember: Int
    dreamCreationCloses: Date
    dreamCreationIsOpen: Boolean
    grantingOpens: Date
    grantingCloses: Date
    grantingIsOpen: Boolean
  }

  scalar Date

  enum RegistrationPolicy {
    OPEN
    REQUEST_TO_JOIN
    INVITE_ONLY
  }

  type Member {
    id: ID!
    event: Event!
    email: String!
    name: String
    avatar: String
    # user: User!
    # isActive: Boolean!
    isAdmin: Boolean!
    isApproved: Boolean!
    verifiedEmail: Boolean!
    createdAt: Date
    availableGrants: Int
    givenGrants: [Grant]
    # isGuide: Boolean!
    # favorites: [Dream]
  }

  type Dream {
    id: ID!
    event: Event!
    slug: String!
    title: String!
    description: String
    summary: String
    images: [Image!]
    members: [Member]!
    minGoalGrants: Int
    maxGoalGrants: Int
    minGoal: Int
    maxGoal: Int
    currentNumberOfGrants: Int
    budgetDescription: String
    approved: Boolean
    # answers: [QuestionAnswer]
    # funding: Int!
    # raisedFlags: [Flag]
    # reactions: [Reaction]
    # tags: [Tag]
  }

  type Grant {
    id: ID!
    dream: Dream!
    value: Int!
    reclaimed: Boolean!
    type: GrantType!
    # user: Member!
  }

  enum GrantType {
    PRE_FUND
    USER
    POST_FUND
  }

  type Image {
    small: String!
    large: String!
  }

  input ImageInput {
    small: String
    large: String
  }

  # enum Visibility {
  #   PUBLIC
  #   PRIVATE # only for paid
  #   HIDDEN # only for paid
  # }

  # type GrantingPeriod {
  #   event: Event!
  #   submissionCloses: Date
  #   grantingStarts: Date
  #   grantingCloses: Date # when this happens. all grants to non-funded projects go back into the pool
  #   name: String
  #   budget: Int
  #   distributeGrants: DistributeGrantStrategy
  # }

  # enum DistributeGrantStrategy {
  #   DISTRIBUTE_EQUALLY # is this possible?
  #   DISTRIBUTE_TO_ACTIVE_USERS
  #   COMMITTEE
  # }

  # type Emoji {
  #   unicode: String!
  #   event: Event!
  # }

  # type Reaction {
  #   emoji: Emoji!
  #   by: Member!
  #   # createdAt
  # }

  # type Comment {
  #   dream: Dream!
  #   by: Member!
  #   createdAt: Date!
  # }

  # type Flag {
  #   title: String!
  #   description: String!
  # }

  # type FlagEvent {
  #   flag: Flag!
  #   flagger: Member!
  # }

  # type Favorite {
  #   dream: Dream!
  #   by: Member!
  # }

  # type QuestionAnswer {
  #   question: Question
  #   answer: String
  # }

  # type Question {
  #   richtext: String
  #   isRequired: Boolean!
  # }

  # type Image {}
`;

module.exports = schema;
