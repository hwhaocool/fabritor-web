/**
 * The page's HTML template structure, using JSX.
 */
import { Meta, Title, Links, Main, Scripts } from 'ice';
import { description } from '../package.json';

export default function Document() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <base href="/fabritor-web/" />
        <link rel="icon" href="./favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <Meta />
        <Title />
        <Links />
        {process.env.NODE_ENV === 'production' && (
          <meta name="build-time" content={new Date().toISOString()} />
        )}
      </head>
      <body>
        <Main />
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__BUILD_TIME__="${new Date().toISOString()}";`
            }}
          />
        )}
        <Scripts />
      </body>
    </html>
  );
}
