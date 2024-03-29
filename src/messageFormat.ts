// specs: http://userguide.icu-project.org/formatparse/messages
// inspiration: https://github.com/formatjs/formatjs/tree/master/packages/intl-messageformat
// why redoing it? => bundle size & curiosity!

// this regexp is used to get all pieces {}
const REGEXP_MESSAGE = /{(.+?)}+/g;

// this regexp is used to remove brackets from a piece
const REGEXP_PIECE = /[{}]/g;

function cleanPiece(piece: string | undefined) {
  return piece && piece.replace(REGEXP_PIECE, "").trim();
}

export default function format(
  message: string,
  data: Record<string, unknown>,
  lang = "en"
) {
  if (!message || message.trim().length === 0) return message;
  const pieces = message.match(REGEXP_MESSAGE);
  if (!pieces) return message;

  return pieces.reduce((newMessage, piece) => {
    // means we have a key with options (eg: {birthday, date})
    // in this case we don't have options, so this is simple, we replace key by the value
    if (!piece.includes(",")) {
      const key = cleanPiece(piece) ?? "";
      return newMessage.replace(piece, (data[key] as string) ?? "");
    }

    // here we have options, we parse the type of options
    // knowing they key is always the first argument, eg in "{birthday, date}" the value key is 'birthday'
    // the second argument is type of options, in previous example this is 'date'
    const pieceOptions = piece.split(",");
    const key = cleanPiece(pieceOptions[0]);
    if (!key || data[key] === null || data[key] === undefined)
      return newMessage.replace(piece, "");
    const type = cleanPiece(pieceOptions[1]);

    switch (type) {
      case "date": {
        // TODO: cache formater
        const value = new Intl.DateTimeFormat(lang).format(
          new Date(data[key] as string)
        );
        return newMessage.replace(piece, value);
      }
      case "currency": {
        const currency = cleanPiece(pieceOptions[2]);
        // TODO: cache formater
        const value = new Intl.NumberFormat(lang, {
          style: "currency",
          currency,
        }).format(data[key] as number);
        return newMessage.replace(piece, value);
      }
      case "number": {
        const value = new Intl.NumberFormat(lang).format(data[key] as number);
        return newMessage.replace(piece, value);
      }
      default: {
        throw new FormatErrorUnknownType(type);
      }
    }
  }, message);
}

export class FormatErrorUnknownType extends Error {
  constructor(public readonly type?: string) {
    super("messageFormat - Unknown type");
  }
}
