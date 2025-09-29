import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
    {
      async requestDidStart() {
        return {
          async didEncounterErrors(requestContext) {
            console.error('GraphQL Error:', requestContext.errors);
          },
        };
      },
    },
  ],
});

// Start the server
const startServer = server.start();

type JwtUserPayload = { userId: string; role: string };

export async function POST(req: NextRequest) {
  await startServer;

  // Parse the request body as JSON
  const { query, variables, operationName } = await req.json();

  // Extract JWT from Authorization header
  const authHeader =
    req.headers.get('authorization') || req.headers.get('Authorization');
  let user: { userId: string; role: string } | undefined;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback-secret'
      );
      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        'userId' in decoded &&
        'role' in decoded
      ) {
        const { userId, role } = decoded as JwtUserPayload;
        user = { userId, role };
      }
    } catch (err) {
      // Invalid token, user remains undefined
    }
  }

  const result = await server.executeOperation(
    {
      query,
      variables,
      operationName,
    },
    {
      contextValue: { user },
    }
  );

  // Debug log
  console.log('GraphQL result:', result);

  // Extract the singleResult for Apollo Client compatibility
  if (result.body?.kind === 'single') {
    return Response.json(result.body.singleResult);
  }
  return new Response(
    JSON.stringify({ errors: [{ message: 'Malformed server response' }] }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
