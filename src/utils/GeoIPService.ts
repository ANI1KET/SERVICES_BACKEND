import path from "path";
import * as maxmind from "maxmind";
import { CityResponse } from "maxmind";

class GeoIPService {
  private static dbPath = path.join(__dirname, "GeoLite2-City.mmdb");
  private static lookup: maxmind.Reader<CityResponse> | null = null;

  public static async init() {
    if (!this.lookup) {
      try {
        this.lookup = await maxmind.open<CityResponse>(this.dbPath);
      } catch (error) {
        throw new Error("Error loading GeoIP database.");
      }
    }
  }

  public static async getCityData(ip: string): Promise<CityResponse | null> {
    if (!this.lookup) {
      throw new Error("MaxMind database not initialized.");
    }

    return this.lookup?.get(ip);
  }
}

export default GeoIPService;
