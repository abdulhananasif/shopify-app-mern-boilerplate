import {GraphqlQueryError} from '@shopify/shopify-api';
import shopify from './shopify.js';

const CREATE_SCRIPT_TAG_MUTATION = `
mutation scriptTagCreate($input: ScriptTagInput!) {
  scriptTagCreate(input: $input) {
    scriptTag {
      id
      src
      displayScope
    }
    userErrors {
      field
      message
    }
  }
}
`;

const DELETE_SCRIPT_TAG_MUTATION = `
mutation scriptTagDelete($id: ID!) {
  scriptTagDelete(id: $id) {
    deletedScriptTagId
    userErrors {
      field
      message
    }
  }
}

`;

const LIST_SCRIPT_TAG_QUERY = `
{
  scriptTags(first: 10) {
    nodes {
      id
      displayScope
      src
      legacyResourceId
      createdAt
      updatedAt
    }
  }
}
`;

export async function scriptTagCreator(session) {
  const client = new shopify.api.clients.Graphql({session});

  try {
    const result = await client.query({
      data: {
        query: CREATE_SCRIPT_TAG_MUTATION,
        variables: {
          input: {
            cache: true,
            displayScope: 'ALL',
            src: 'https://www.hanan.com',
          },
        },
      },
    });
    return result.body.data.scriptTagCreate;
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
export async function scriptTagRemover(session, id) {
  const client = new shopify.api.clients.Graphql({session});

  try {
    await client.query({
      data: {
        query: DELETE_SCRIPT_TAG_MUTATION,
        variables: {
          id: id,
        },
      },
    });
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}

export async function scriptTagList(session) {
  const client = new shopify.api.clients.Graphql({session});

  try {
    await client.query({
      data: {
        query: LIST_SCRIPT_TAG_QUERY,
      },
    });
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
