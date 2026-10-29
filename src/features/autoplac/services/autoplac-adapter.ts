import { AutoplacFeedService, FeedGenerationResult } from "./autoplac-feed-service";

export interface VehicleExportAdapter {
  exportVehicles(identifierToken: string): Promise<FeedGenerationResult>;
}

export class AutoplacXmlFeedAdapter implements VehicleExportAdapter {
  async exportVehicles(identifierToken: string): Promise<FeedGenerationResult> {
    return await AutoplacFeedService.generateFeedByToken(identifierToken);
  }
}
