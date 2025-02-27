// @generated
// This file was automatically generated and should not be edited.

@_exported import ApolloAPI

public class AvailableFeaturesQuery: GraphQLQuery {
  public static let operationName: String = "availableFeatures"
  public static let operationDocument: ApolloAPI.OperationDocument = .init(
    definition: .init(
      #"query availableFeatures($id: String!) { workspace(id: $id) { __typename availableFeatures } }"#
    ))

  public var id: String

  public init(id: String) {
    self.id = id
  }

  public var __variables: Variables? { ["id": id] }

  public struct Data: AffineGraphQL.SelectionSet {
    public let __data: DataDict
    public init(_dataDict: DataDict) { __data = _dataDict }

    public static var __parentType: any ApolloAPI.ParentType { AffineGraphQL.Objects.Query }
    public static var __selections: [ApolloAPI.Selection] { [
      .field("workspace", Workspace.self, arguments: ["id": .variable("id")]),
    ] }

    /// Get workspace by id
    public var workspace: Workspace { __data["workspace"] }

    /// Workspace
    ///
    /// Parent Type: `WorkspaceType`
    public struct Workspace: AffineGraphQL.SelectionSet {
      public let __data: DataDict
      public init(_dataDict: DataDict) { __data = _dataDict }

      public static var __parentType: any ApolloAPI.ParentType { AffineGraphQL.Objects.WorkspaceType }
      public static var __selections: [ApolloAPI.Selection] { [
        .field("__typename", String.self),
        .field("availableFeatures", [GraphQLEnum<AffineGraphQL.FeatureType>].self),
      ] }

      /// Available features of workspace
      public var availableFeatures: [GraphQLEnum<AffineGraphQL.FeatureType>] { __data["availableFeatures"] }
    }
  }
}
