import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';

import { File } from './dto/file.dto';
import { FileService } from './file.service';

@Resolver(() => File)
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Mutation(() => File)
  async createFile(
    @Args('url') url: string,
    @Args('name') name: string,
    @Args('lost_id', { type: () => Int }) lost_id: number,
  ) {
    return this.fileService.createFile({ url, name, lost_id });
  }

  @Query(() => [File])
  async filesByLostId(@Args('lost_id', { type: () => Int }) lost_id: number) {
    return this.fileService.findFilesByLostId(lost_id);
  }
}
