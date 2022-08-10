import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppDefaultLayout } from '~/layouts/AppDefaultLayout'

const theme = extendTheme({
  colors: {
    slack: {
      100: 'rgb(255,0,0)',
      500: 'rgb(74, 21, 75)'
    }
  }
})
const queryClient = new QueryClient()

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => JSX.Element
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ||
    ((page) => <AppDefaultLayout>{page}</AppDefaultLayout>)

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
