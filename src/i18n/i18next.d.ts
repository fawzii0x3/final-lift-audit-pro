import "i18next";
import { resources, defaultNS } from ".";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["en"];
    // Enable the new selector API for better performance
    enableSelector: "optimize";
    // Allow null values as valid translation
    returnNull: true;
    // Allow objects as valid translation result
    returnObjects: false;
    // Enable strict key checking
    strictKeyChecks: true;
  }
}
