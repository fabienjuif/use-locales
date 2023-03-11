import { useContext, useState, useLayoutEffect, useRef } from "react";
import { LocalesContext } from "./context";
import format from "./messageFormat";

export function useLocales<T>(
  path?: string,
  object?: Record<string, unknown>
): T {
  const firstDraw = useRef(true);
  const { getMessages, lang } = useContext(LocalesContext);
  const [messages, setMessages] = useState(getMessages(path));

  useLayoutEffect(() => {
    const rawMessage = getMessages(path);

    if (firstDraw.current && !object) return;
    firstDraw.current = false;

    if (!object) {
      setMessages(rawMessage);
      return;
    }

    setMessages(
      Object.entries(rawMessage).reduce((acc, [key, value]) => {
        if (typeof value !== "string") return acc;
        return {
          ...acc,
          [key]: format(value, object, lang),
        };
      }, {})
    );
  }, [path, object]);

  return messages as T;
}
