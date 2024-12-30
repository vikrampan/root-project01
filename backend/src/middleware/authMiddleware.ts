// src/middleware/authMiddleware.ts
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies } from 'nookies';

// Define base props interface that includes token
interface AuthProps {
  token: string;
  [key: string]: any;
}

export function withAuth<P extends AuthProps>(
  gssp?: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    try {
      // Get token from cookies
      const cookies = parseCookies(context);
      const token = cookies.token;

      // If no token is found, redirect to login
      if (!token) {
        return {
          redirect: {
            destination: '/auth/signin',
            permanent: false,
          },
        };
      }

      // If gssp is provided, call it
      if (gssp) {
        const result = await gssp(context);

        // Handle redirects
        if ('redirect' in result) {
          return result;
        }

        // Handle notFound
        if ('notFound' in result) {
          return result;
        }

        // Merge props with token
        if ('props' in result) {
          return {
            props: {
              ...result.props,
              token,
            } as P,
          };
        }
      }

      // Return token as props if no gssp
      return {
        props: {
          token,
        } as unknown as P,
      };
    } catch (error) {
      console.error('Auth middleware error:', error);
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    }
  };
}

// API route middleware
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export function withAuthAPI(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      return handler(req, res);
    } catch (error) {
      console.error('API auth middleware error:', error);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
}