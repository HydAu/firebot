import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { AppConfig } from "config/app.config";
import { FlatFileDataStore } from "data-access/flatfile-store";
import { UserProfile } from "firebot-types";
import path from "path";

type GlobalSettings = {
    activeProfileId: string
    profiles: UserProfile[],
}

@Injectable()
export class GlobalSettingsStore extends FlatFileDataStore<GlobalSettings> {
  constructor(
    @Inject(AppConfig.KEY)
    private appConfig: ConfigType<typeof AppConfig>
  ) {
    const filePath = path.join(appConfig.firebotDataPath, "global-settings");
    super(filePath, {
      activeProfileId: "Default Profile",
      profiles: [
        {
          id: "Default Profile",
          name: "Default Profile",
        },
      ],
    });
  }
}