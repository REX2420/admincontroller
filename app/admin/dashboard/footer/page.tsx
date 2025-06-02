"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Button, Paper, Title, Text, Loader, Center } from "@mantine/core";
import CompanyInfoForm from "@/components/admin/dashboard/footer/company-info-form";
import SocialMediaForm from "@/components/admin/dashboard/footer/social-media-form";
import NavigationSectionForm from "@/components/admin/dashboard/footer/navigation-section-form";
import NewsletterForm from "@/components/admin/dashboard/footer/newsletter-form";
import SettingsForm from "@/components/admin/dashboard/footer/settings-form";
import FooterPreview from "@/components/admin/dashboard/footer/footer-preview";
import { getActiveFooter, createDefaultFooter } from "@/lib/database/actions/admin/footer/footer.actions";
import { MdSettings, MdBusiness, MdShare, MdNavigation, MdEmail, MdPreview } from "react-icons/md";

const FooterManagementPage = () => {
  const [footerData, setFooterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const response = await getActiveFooter();
      
      if (response.success && response.footer) {
        setFooterData(response.footer);
      } else {
        // Create default footer if none exists
        const defaultResponse = await createDefaultFooter();
        if (defaultResponse.success) {
          setFooterData(defaultResponse.footer);
        }
      }
    } catch (error) {
      console.error("Error fetching footer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const refreshFooterData = () => {
    fetchFooterData();
  };

  if (loading) {
    return (
      <Center style={{ height: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size="lg" mb="md" />
          <Text c="dimmed">Loading footer configuration...</Text>
        </div>
      </Center>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title order={1} mb="sm">Footer Management</Title>
        <Text c="dimmed">
          Manage all footer content including company information, social media links, 
          navigation sections, and settings.
        </Text>
      </div>

      <Paper p="lg" withBorder>
        <Tabs defaultValue="company">
          <Tabs.List mb="lg">
            <Tabs.Tab value="company" leftSection={<MdBusiness size={16} />}>
              Company Info
            </Tabs.Tab>
            <Tabs.Tab value="social" leftSection={<MdShare size={16} />}>
              Social Media
            </Tabs.Tab>
            <Tabs.Tab value="navigation" leftSection={<MdNavigation size={16} />}>
              Navigation
            </Tabs.Tab>
            <Tabs.Tab value="newsletter" leftSection={<MdEmail size={16} />}>
              Newsletter
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<MdSettings size={16} />}>
              Settings
            </Tabs.Tab>
            <Tabs.Tab value="preview" leftSection={<MdPreview size={16} />}>
              Preview
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="company">
            <CompanyInfoForm 
              footerData={footerData} 
              onUpdate={refreshFooterData}
            />
          </Tabs.Panel>

          <Tabs.Panel value="social">
            <SocialMediaForm 
              footerData={footerData} 
              onUpdate={refreshFooterData}
            />
          </Tabs.Panel>

          <Tabs.Panel value="navigation">
            <NavigationSectionForm 
              footerData={footerData} 
              onUpdate={refreshFooterData}
            />
          </Tabs.Panel>

          <Tabs.Panel value="newsletter">
            <NewsletterForm 
              footerData={footerData} 
              onUpdate={refreshFooterData}
            />
          </Tabs.Panel>

          <Tabs.Panel value="settings">
            <SettingsForm 
              footerData={footerData} 
              onUpdate={refreshFooterData}
            />
          </Tabs.Panel>

          <Tabs.Panel value="preview">
            <FooterPreview footerData={footerData} />
          </Tabs.Panel>
        </Tabs>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outline"
            onClick={refreshFooterData}
          >
            Refresh Data
          </Button>
          
          <Text size="sm" c="dimmed">
            Last updated: {footerData?.updatedAt ? new Date(footerData.updatedAt).toLocaleString() : 'Never'}
          </Text>
        </div>
      </Paper>
    </div>
  );
};

export default FooterManagementPage; 