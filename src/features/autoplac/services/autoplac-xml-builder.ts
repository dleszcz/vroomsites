import { AutoplacFeedMetadata, AutoplacVehicleNode } from "../types";

export function escapeXml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export class AutoplacXmlBuilder {
  /**
   * Generuje dokument XML zgodny ze standardem Autoplac.pl / Yanosik
   */
  static buildFeed(metadata: AutoplacFeedMetadata, vehicles: AutoplacVehicleNode[]): string {
    const lines: string[] = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<feed xmlns="https://autoplac.pl/schema/export-v1" version="1.0">',
      '  <metadata>',
      `    <generated_at>${escapeXml(metadata.generatedAt)}</generated_at>`,
      `    <dealer_name>${escapeXml(metadata.dealerName)}</dealer_name>`,
      `    <dealer_city>${escapeXml(metadata.dealerCity)}</dealer_city>`,
      `    <dealer_phone>${escapeXml(metadata.dealerPhone)}</dealer_phone>`,
      `    <vehicles_count>${metadata.vehiclesCount}</vehicles_count>`,
      '  </metadata>',
      '  <vehicles>',
    ];

    for (const vehicle of vehicles) {
      lines.push('    <vehicle>');
      lines.push(`      <id>${escapeXml(vehicle.id)}</id>`);
      if (vehicle.vin) {
        lines.push(`      <vin>${escapeXml(vehicle.vin)}</vin>`);
      }
      lines.push(`      <make>${escapeXml(vehicle.make)}</make>`);
      lines.push(`      <model>${escapeXml(vehicle.model)}</model>`);
      lines.push(`      <year>${vehicle.year}</year>`);
      lines.push(`      <price currency="${vehicle.currency}">${vehicle.price}</price>`);
      lines.push(`      <mileage unit="km">${vehicle.mileage}</mileage>`);
      lines.push(`      <fuel_type>${escapeXml(vehicle.fuelType)}</fuel_type>`);
      if (vehicle.engineCapacity) {
        lines.push(`      <engine_capacity>${escapeXml(vehicle.engineCapacity)}</engine_capacity>`);
      }
      lines.push(`      <transmission>${escapeXml(vehicle.transmission)}</transmission>`);
      if (vehicle.color) {
        lines.push(`      <color>${escapeXml(vehicle.color)}</color>`);
      }
      if (vehicle.firstRegistrationDate) {
        lines.push(`      <first_registration_date>${escapeXml(vehicle.firstRegistrationDate)}</first_registration_date>`);
      }
      const safeDescription = (vehicle.description || "").replace(/\]\]>/g, "]]]]><![CDATA[>");
      lines.push(`      <description><![CDATA[${safeDescription}]]></description>`);

      if (vehicle.photos && vehicle.photos.length > 0) {
        lines.push('      <photos>');
        for (const photoUrl of vehicle.photos) {
          lines.push(`        <photo>${escapeXml(photoUrl)}</photo>`);
        }
        lines.push('      </photos>');
      }

      lines.push('    </vehicle>');
    }

    lines.push('  </vehicles>');
    lines.push('</feed>');

    return lines.join('\n');
  }
}
