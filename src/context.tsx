/* eslint-env browser */
import React, { createContext, useEffect, useCallback, useMemo } from "react";
import useLocalStorage from "react-use/esm/useLocalStorage";

const getFromPath = (data: any, path: string) =>
  path.split(".").reduce((curr, sub) => curr && curr[sub], data);

const defaultObject = Object.freeze({});
type GetMessages = (path?: string) => Record<string, unknown>;

const Context = createContext<{
  lang: string;
  getMessages: GetMessages;
  locales?: Locales;
}>({
  lang: "en",
  getMessages: () => defaultObject,
});

const messageProxy = {
  set() {
    throw new Error("[use-locales] messages is unvariant.");
  },
  get(obj: Record<string, unknown>, prop: string) {
    return obj[prop] || prop;
  },
};

export interface Locales {
  date?: number;
  lang?: string;
  hashKey?: string | number;
  data?: Record<string, unknown>;
}

export interface LocalesProviderProps {
  children: any;
  loadingElm?: any;
  hashKey?: string | number;
}

export function LocalesProvider({
  children,
  loadingElm,
  hashKey,
}: LocalesProviderProps) {
  const [lang, setLang] = useLocalStorage<string>("lang", "en");
  const [locales, setLocales] = useLocalStorage<Locales>("locales", undefined);

  useEffect(() => {
    // load lang
    let currentLang: string | undefined = lang;
    if (!lang) {
      // retrieve lang from navigator
      const { navigator } = window;
      if (navigator) {
        const { language, userLanguage, languages } = navigator as Navigator & {
          userLanguage?: string;
        };
        currentLang =
          language ||
          userLanguage ||
          (languages && languages.length && languages[0]) ||
          "en";
        if (currentLang.length > 2) currentLang = currentLang.substring(0, 2);
        if (currentLang.length < 2) currentLang = "en";
      }
      setLang(currentLang);
    }

    // load locales
    if (
      !locales ||
      !locales.date ||
      !locales.lang ||
      locales.lang !== currentLang ||
      (hashKey && hashKey !== locales.hashKey) ||
      Date.now() - locales.date > 259200000 /* 3 days */
    ) {
      const loadLocales = (fetchLang = "en") =>
        fetch(
          `${process.env.PUBLIC_URL}/locales/${fetchLang}.json${
            hashKey ? `?hashKey=${hashKey}` : ""
          }`
        )
          .then((raw) => raw.json())
          .then((newLocales) =>
            setLocales({
              data: newLocales,
              lang: fetchLang,
              date: Date.now(),
              hashKey,
            })
          );

      loadLocales(currentLang).catch(() => {
        setLang("en");
        loadLocales("en");
      });
    }
  }, [hashKey]);

  const getMessages: GetMessages = useCallback(
    (path = "") => {
      if (!locales) return defaultObject;
      let { data: messages } = locales;
      if (path !== "") messages = getFromPath(locales.data, path);
      if (!messages) return defaultObject;
      if (typeof Proxy !== "undefined")
        return new Proxy(messages, messageProxy);
      return messages;
    },
    [locales]
  );

  const value = useMemo(
    () => ({
      lang: lang ?? "en",
      locales,
      getMessages,
    }),
    [lang, locales, getMessages]
  );

  if (!locales) return loadingElm;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export { Context as LocalesContext };
