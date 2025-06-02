"use client";

import React from "react";
import { Paper, Title, Text, Group, Button, TextInput, Alert } from "@mantine/core";
import Link from "next/link";
import { MdInfo, MdFacebook, MdEmail } from "react-icons/md";
import { 
  FaInstagram, 
  FaYoutube, 
  FaTwitter, 
  FaLinkedin, 
  FaTiktok, 
  FaPinterest 
} from "react-icons/fa";

interface FooterPreviewProps {
  footerData: any;
}

const FooterPreview: React.FC<FooterPreviewProps> = ({ footerData }) => {
  const getSocialIcon = (platform: string) => {
    const iconMap: { [key: string]: any } = {
      facebook: MdFacebook,
      instagram: FaInstagram,
      youtube: FaYoutube,
      twitter: FaTwitter,
      linkedin: FaLinkedin,
      tiktok: FaTiktok,
      pinterest: FaPinterest,
    };
    return iconMap[platform] || MdEmail;
  };

  const formatAddress = (address: any) => {
    if (!address) return "";
    return [address.street, address.city, address.state, address.zipCode, address.country]
      .filter(Boolean)
      .join(", ");
  };

  if (!footerData) {
    return (
      <Paper p="md">
        <Alert icon={<MdInfo />} title="No Footer Data">
          No footer data available to preview. Please configure the footer settings first.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper p="md">
      <Title order={2} mb="lg">Footer Preview</Title>
      
      <Alert icon={<MdInfo />} title="Live Preview" mb="lg">
        This is how your footer will appear on the website. Changes made in other tabs will be reflected here.
      </Alert>

      {/* Footer Preview Container */}
      <Paper
        withBorder
        p="xl"
        style={{
          backgroundColor: footerData?.settings?.backgroundColor || "#1c1c1c",
          color: footerData?.settings?.textColor || "#ffffff",
          minHeight: "400px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "32px",
            marginBottom: "48px",
          }}
        >
          {/* Company Info Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Text size="xl" fw={700}>{footerData?.companyInfo?.name || "VIBECART"}</Text>
            
            {footerData?.companyInfo?.description && (
              <Text size="sm">{footerData.companyInfo.description}</Text>
            )}
            
            {footerData?.companyInfo?.address && (
              <Text size="sm">{formatAddress(footerData.companyInfo.address)}</Text>
            )}
            
            {footerData?.companyInfo?.contact?.email && (
              <Text size="sm">{footerData.companyInfo.contact.email}</Text>
            )}
            
            {footerData?.companyInfo?.contact?.phone && (
              <Text size="sm">{footerData.companyInfo.contact.phone}</Text>
            )}
            
            {/* Social Media Icons */}
            {footerData?.socialMedia && footerData.socialMedia.length > 0 && (
              <Group gap="sm">
                {footerData.socialMedia
                  .filter((social: any) => social.isActive)
                  .map((social: any, index: number) => {
                    const IconComponent = getSocialIcon(social.platform);
                    return (
                      <div
                        key={index}
                        style={{
                          padding: "4px",
                          cursor: "pointer",
                          opacity: 0.8,
                        }}
                      >
                        <IconComponent size={20} />
                      </div>
                    );
                  })}
              </Group>
            )}
          </div>

          {/* Navigation Sections */}
          {footerData?.navigationSections &&
            footerData.navigationSections
              .filter((section: any) => section.isActive)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((section: any, index: number) => (
                <div key={index}>
                  <Text size="lg" fw={600} mb="md">{section.sectionTitle}</Text>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {section.links
                      ?.filter((link: any) => link.isActive)
                      ?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                      ?.map((link: any, linkIndex: number) => (
                        <Text
                          key={linkIndex}
                          size="sm"
                          style={{ cursor: "pointer", opacity: 0.8 }}
                        >
                          {link.title}
                        </Text>
                      ))}
                  </div>
                </div>
              ))}

          {/* Newsletter Section */}
          {footerData?.newsletter?.isActive && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Text size="lg" fw={600}>{footerData.newsletter.title}</Text>
              <Text size="sm" style={{ opacity: 0.8 }}>
                {footerData.newsletter.description}
              </Text>
              <Group gap={0}>
                <TextInput
                  placeholder="Email Address"
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      borderRadius: "4px 0 0 4px",
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                  disabled
                />
                <Button
                  style={{
                    borderRadius: "0 4px 4px 0",
                    backgroundColor: "white",
                    color: "black",
                  }}
                  disabled
                >
                  {footerData.newsletter.buttonText}
                </Button>
              </Group>
              {footerData?.settings?.showSecurePayments && (
                <Text size="sm" fw={500}>
                  {footerData.settings.securePaymentsText}
                </Text>
              )}
            </div>
          )}
        </div>

        {/* Footer Bottom */}
        <div
          style={{
            paddingTop: "32px",
            borderTop: `1px solid ${footerData?.settings?.textColor || "#ffffff"}33`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Text size="sm">{footerData?.copyright?.text || "© 2025 VIBECART"}</Text>
          <Group gap="lg">
            {footerData?.localization?.showLanguage && (
              <Group gap="xs">
                <Text size="sm">Language</Text>
                <Text size="sm" fw={500}>
                  {footerData.localization.country} | {footerData.localization.language}
                </Text>
              </Group>
            )}
            {footerData?.localization?.showCurrency && (
              <Group gap="xs">
                <Text size="sm">Currency</Text>
                <Text size="sm" fw={500}>{footerData.localization.currency}</Text>
              </Group>
            )}
          </Group>
        </div>
      </Paper>

      {/* Preview Information */}
      <Alert icon={<MdInfo />} title="Preview Information" mt="lg">
        <Text size="sm">
          • This preview shows how your footer will appear on the website
          • Active sections and links are displayed, inactive ones are hidden
          • Colors and styling match your current settings
          • Social media icons and newsletter form are shown as they would appear
        </Text>
      </Alert>
    </Paper>
  );
};

export default FooterPreview; 