import { IsNotEmpty } from 'class-validator';

export class MetadataRefresh {
  @IsNotEmpty()
  completeTokenIds: string[];
}
