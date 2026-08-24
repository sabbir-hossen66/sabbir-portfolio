import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ListMessagesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30;

  /** Cursor-based pagination — pass the `id` of the last item you saw. */
  @IsOptional()
  @IsString()
  cursor?: string;
}
