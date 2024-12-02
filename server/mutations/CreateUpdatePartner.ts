import { gql } from "@apollo/client/core";
import partnerFragment from "../fragments/partnerFragment";

export default gql`
  mutation CreateUpdatePartner(
    $name: String!
    $email: String!
    $subscribeNewsletter: Boolean!
  ) {
    createUpdatePartner(
      name: $name
      email: $email
      subscribeNewsletter: $subscribeNewsletter
    ) {
      id
      name
      email
      isPublic
    }
  }
`;
