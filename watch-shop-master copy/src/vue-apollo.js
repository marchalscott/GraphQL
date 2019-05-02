//import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client';
 import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client';
 import Vue from 'vue';
 import VueApollo from 'vue-apollo';
 
 Vue.use(VueApollo);
 
 const AUTH_TOKEN = 'apollo-token';
 
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000';
 const defaultOptions = {
   httpEndpoint,
   wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000',
   tokenName: AUTH_TOKEN,
   persisting: false,
   websocketsOnly: false,
   ssr: false,
 };
 
 export function createProvider(options = {}) {
//const { apolloClient, wsClient } = createApolloClient({
const { apolloClient } = createApolloClient({
     ...defaultOptions,
     ...options,
   });
//apolloClient.wsClient = wsClient;
 
   const apolloProvider = new VueApollo({
     defaultClient: apolloClient,
     defaultOptions: {
       $query: {},
     },
     errorHandler(error) {
       // eslint-disable-next-line
       console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message);
     },
   });
 
   return apolloProvider;
 }
 
 export async function onLogin(apolloClient, token) {
   if (typeof localStorage !== 'undefined' && token) {
     localStorage.setItem(AUTH_TOKEN, token);
   }
//if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
   try {
     await apolloClient.resetStore();
   } catch (e) {
     // eslint-disable-next-line
     console.log('%cError on cache reset (login)', 'color: orange;', e.message);
   }
 }
 
 export async function onLogout(apolloClient) {
   if (typeof localStorage !== 'undefined') {
     localStorage.removeItem(AUTH_TOKEN);
   }
//if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
   try {
     await apolloClient.resetStore();
   } catch (e) {
     // eslint-disable-next-line
     console.log('%cError on cache reset (logout)', 'color: orange;', e.message);
   }
 }