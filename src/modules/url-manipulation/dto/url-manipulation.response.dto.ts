export class FileStructure {
  [directory: string]: (string | FileStructure)[];
}

export class UrlManipulationResponseDto {
  [ip: string]: FileStructure[];
}
