import type frMessages from "@/i18n/messages/fr.json";

type Messages = typeof frMessages;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}

export {};
