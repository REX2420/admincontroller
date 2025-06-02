"use client";

import React, { useState } from "react";
import { 
  Paper, 
  Title, 
  TextInput, 
  Button, 
  Group, 
  Alert,
  Grid,
  Switch,
  ColorInput,
  Text,
  Select
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { updateFooterSettings, updateLocalizationSettings, updateCopyrightSettings } from "@/lib/database/actions/admin/footer/footer.actions";
import { MdInfo, MdPalette, MdLanguage } from "react-icons/md";

interface SettingsFormProps {
  footerData: any;
  onUpdate: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ footerData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [localizationLoading, setLocalizationLoading] = useState(false);
  const [copyrightLoading, setCopyrightLoading] = useState(false);

  const settingsForm = useForm({
    initialValues: {
      backgroundColor: footerData?.settings?.backgroundColor || "#1c1c1c",
      textColor: footerData?.settings?.textColor || "#ffffff",
      showSecurePayments: footerData?.settings?.showSecurePayments ?? true,
      securePaymentsText: footerData?.settings?.securePaymentsText || "Secure Payments",
      isActive: footerData?.settings?.isActive ?? true,
    },
  });

  const localizationForm = useForm({
    initialValues: {
      language: footerData?.localization?.language || "English",
      country: footerData?.localization?.country || "Maldives",
      currency: footerData?.localization?.currency || "MVR",
      showLanguage: footerData?.localization?.showLanguage ?? true,
      showCurrency: footerData?.localization?.showCurrency ?? true,
    },
  });

  const copyrightForm = useForm({
    initialValues: {
      text: footerData?.copyright?.text || "© 2025 Iilaanshop",
      showYear: footerData?.copyright?.showYear ?? true,
    },
  });

  const handleSettingsSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const response = await updateFooterSettings(values);
      
      if (response.success) {
        alert("Footer settings updated successfully!");
        onUpdate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating footer settings:", error);
      alert("Error updating footer settings");
    } finally {
      setLoading(false);
    }
  };

  const handleLocalizationSubmit = async (values: any) => {
    try {
      setLocalizationLoading(true);
      
      const response = await updateLocalizationSettings(values);
      
      if (response.success) {
        alert("Localization settings updated successfully!");
        onUpdate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating localization settings:", error);
      alert("Error updating localization settings");
    } finally {
      setLocalizationLoading(false);
    }
  };

  const handleCopyrightSubmit = async (values: any) => {
    try {
      setCopyrightLoading(true);
      
      const response = await updateCopyrightSettings(values);
      
      if (response.success) {
        alert("Copyright settings updated successfully!");
        onUpdate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating copyright settings:", error);
      alert("Error updating copyright settings");
    } finally {
      setCopyrightLoading(false);
    }
  };

  const languages = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Chinese", label: "Chinese" },
    { value: "Japanese", label: "Japanese" },
  ];

  const countries = [
    { value: "Maldives", label: "Maldives" },
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Australia", label: "Australia" },
    { value: "Germany", label: "Germany" },
    { value: "France", label: "France" },
    { value: "Spain", label: "Spain" },
    { value: "Italy", label: "Italy" },
  ];

  const currencies = [
    { value: "MVR", label: "MVR - Maldivian Rufiyaa" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "CNY", label: "CNY - Chinese Yuan" },
  ];

  return (
    <div>
      {/* Appearance Settings */}
      <Paper p="md" mb="xl">
        <Title order={2} mb="lg">Appearance Settings</Title>
        
        <Alert icon={<MdPalette />} title="Footer Appearance" mb="lg">
          Customize the visual appearance of your footer.
        </Alert>

        <form onSubmit={settingsForm.onSubmit(handleSettingsSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <Switch
                {...settingsForm.getInputProps('isActive', { type: 'checkbox' })}
                label="Enable Footer"
                description="When disabled, the footer will be completely hidden from the website"
                mb="lg"
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <ColorInput
                label="Background Color"
                placeholder="#1c1c1c"
                {...settingsForm.getInputProps('backgroundColor')}
                swatches={[
                  '#1c1c1c', '#2c3e50', '#34495e', '#000000',
                  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6'
                ]}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <ColorInput
                label="Text Color"
                placeholder="#ffffff"
                {...settingsForm.getInputProps('textColor')}
                swatches={[
                  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
                  '#000000', '#495057', '#6c757d', '#adb5bd'
                ]}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Switch
                {...settingsForm.getInputProps('showSecurePayments', { type: 'checkbox' })}
                label="Show Secure Payments"
                description="Display secure payments information in the footer"
                mb="sm"
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Secure Payments Text"
                placeholder="Secure Payments"
                {...settingsForm.getInputProps('securePaymentsText')}
                disabled={!settingsForm.values.showSecurePayments}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl">
            <Button type="submit" loading={loading}>
              Save Appearance Settings
            </Button>
          </Group>
        </form>
      </Paper>

      {/* Localization Settings */}
      <Paper p="md" mb="xl">
        <Title order={2} mb="lg">Localization Settings</Title>
        
        <Alert icon={<MdLanguage />} title="Language & Region" mb="lg">
          Configure language, country, and currency display settings.
        </Alert>

        <form onSubmit={localizationForm.onSubmit(handleLocalizationSubmit)}>
          <Grid>
            <Grid.Col span={4}>
              <Select
                label="Language"
                placeholder="Select language"
                data={languages}
                {...localizationForm.getInputProps('language')}
                searchable
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <Select
                label="Country"
                placeholder="Select country"
                data={countries}
                {...localizationForm.getInputProps('country')}
                searchable
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <Select
                label="Currency"
                placeholder="Select currency"
                data={currencies}
                {...localizationForm.getInputProps('currency')}
                searchable
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Switch
                {...localizationForm.getInputProps('showLanguage', { type: 'checkbox' })}
                label="Show Language/Country"
                description="Display language and country information in footer"
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Switch
                {...localizationForm.getInputProps('showCurrency', { type: 'checkbox' })}
                label="Show Currency"
                description="Display currency information in footer"
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl">
            <Button type="submit" loading={localizationLoading}>
              Save Localization Settings
            </Button>
          </Group>
        </form>
      </Paper>

      {/* Copyright Settings */}
      <Paper p="md">
        <Title order={2} mb="lg">Copyright Settings</Title>
        
        <Alert icon={<MdInfo />} title="Copyright Information" mb="lg">
          Configure the copyright text that appears at the bottom of the footer.
        </Alert>

        <form onSubmit={copyrightForm.onSubmit(handleCopyrightSubmit)}>
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Copyright Text"
                placeholder="© 2025 Iilaanshop"
                {...copyrightForm.getInputProps('text')}
                required
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <div style={{ paddingTop: '25px' }}>
                <Switch
                  {...copyrightForm.getInputProps('showYear', { type: 'checkbox' })}
                  label="Show Current Year"
                  description="Automatically update year"
                />
              </div>
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl">
            <Button type="submit" loading={copyrightLoading}>
              Save Copyright Settings
            </Button>
          </Group>
        </form>
      </Paper>

      {/* Preview Section */}
      <Paper withBorder p="md" mt="xl" style={{ backgroundColor: settingsForm.values.backgroundColor, color: settingsForm.values.textColor }}>
        <Title order={3} size="md" mb="md" style={{ color: settingsForm.values.textColor }}>
          Footer Preview
        </Title>
        <Text size="sm" mb="sm">This is how your footer colors will look.</Text>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${settingsForm.values.textColor}33` }}>
          <Text size="sm">{copyrightForm.values.text}</Text>
          <div style={{ display: 'flex', gap: '16px' }}>
            {localizationForm.values.showLanguage && (
              <Text size="sm">
                {localizationForm.values.country} | {localizationForm.values.language}
              </Text>
            )}
            {localizationForm.values.showCurrency && (
              <Text size="sm">{localizationForm.values.currency}</Text>
            )}
          </div>
        </div>
        {settingsForm.values.showSecurePayments && (
          <Text size="sm" mt="sm" fw={500}>{settingsForm.values.securePaymentsText}</Text>
        )}
      </Paper>
    </div>
  );
};

export default SettingsForm; 