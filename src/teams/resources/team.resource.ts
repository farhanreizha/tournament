import { Injectable } from "@nestjs/common";

@Injectable()
export class TeamResource {
  toJSON(team: any) {
    return {
      id: team.id,
      name: team.name,
      creator: team.creator?.username || null,
    };
  }
}
