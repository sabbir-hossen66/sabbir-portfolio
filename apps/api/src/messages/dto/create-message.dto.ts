import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

/** Whitelisted categories — matches the chips on the public form. */
export const MESSAGE_CATEGORIES = ["compliment", "project", "hire", "chat"] as const;
export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number];

/** Small allowlist of safe emojis. Server enforces this so the client can't slip
 *  arbitrary graphemes through. The form can still send no emoji at all. */
const EMOJI_ALLOWLIST = /^[❤️☕🚀💼💬🙏🔥✨💡🤝🌟🎉👍🙌]+$/u;

export class CreateMessageDto {
  @IsIn(MESSAGE_CATEGORIES as unknown as string[], {
    message: `category must be one of: ${MESSAGE_CATEGORIES.join(", ")}`,
  })
  category!: MessageCategory;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  @Matches(EMOJI_ALLOWLIST, {
    message: "emoji must be one of: ❤️ ☕ 🚀 💼 💬 🙏 🔥 ✨ 💡 🤝 🌟 🎉 👍 🙌",
  })
  emoji?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  @MinLength(1)
  name?: string;

  @IsString()
  @MinLength(1, { message: "message can't be empty" })
  @MaxLength(2000, { message: "message is too long (max 2000 chars)" })
  message!: string;
}
