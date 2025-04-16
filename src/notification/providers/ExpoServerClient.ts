import { Provider } from '@nestjs/common';

import { Expo, ExpoPushMessage } from 'expo-server-sdk';

export type ExpoServerClient = Expo & {
  isExpoPushToken: (token: string) => boolean;
};

export type NotificationMessage = ExpoPushMessage;

export const ExpoServerClientProviderTokenName = 'ExpoServerClient';

export const ExpoServerClientProvider: Provider = {
  provide: ExpoServerClientProviderTokenName,
  useFactory: async () => {
    const expoClient = new Expo();
    return expoClient;
  },
};
