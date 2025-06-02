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
  Card,
  Text,
  ActionIcon,
  Modal,
  NumberInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { addOrUpdateNavigationSection, removeNavigationSection } from "@/lib/database/actions/admin/footer/footer.actions";
import { MdAdd, MdDelete, MdEdit, MdInfo, MdLink } from "react-icons/md";

interface NavigationSectionFormProps {
  footerData: any;
  onUpdate: () => void;
}

const NavigationSectionForm: React.FC<NavigationSectionFormProps> = ({ footerData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      sectionTitle: "",
      links: [{ title: "", url: "", isActive: true, order: 1 }],
      isActive: true,
      order: 1,
    },
    validate: {
      sectionTitle: (value) => !value ? "Section title is required" : null,
      links: {
        title: (value) => !value ? "Link title is required" : null,
        url: (value) => !value ? "URL is required" : null,
      },
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const sectionData = {
        ...values,
        _id: editingSection?._id,
      };
      
      const response = await addOrUpdateNavigationSection(sectionData);
      
      if (response.success) {
        alert(`Navigation section ${editingSection ? 'updated' : 'created'} successfully!`);
        form.reset();
        setEditingSection(null);
        close();
        onUpdate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error saving navigation section:", error);
      alert("Error saving navigation section");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: any) => {
    setEditingSection(section);
    form.setValues({
      sectionTitle: section.sectionTitle,
      links: section.links || [{ title: "", url: "", isActive: true, order: 1 }],
      isActive: section.isActive,
      order: section.order || 1,
    });
    open();
  };

  const handleRemove = async (sectionId: string, sectionTitle: string) => {
    if (!confirm(`Are you sure you want to remove the "${sectionTitle}" section?`)) return;

    try {
      const response = await removeNavigationSection(sectionId);
      
      if (response.success) {
        alert("Navigation section removed successfully!");
        onUpdate();
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error removing navigation section:", error);
      alert("Error removing navigation section");
    }
  };

  const addNewLink = () => {
    const currentLinks = form.values.links;
    form.setFieldValue('links', [
      ...currentLinks,
      { title: "", url: "", isActive: true, order: currentLinks.length + 1 }
    ]);
  };

  const removeLink = (index: number) => {
    const currentLinks = form.values.links;
    form.setFieldValue('links', currentLinks.filter((_, i) => i !== index));
  };

  const openNewSectionModal = () => {
    setEditingSection(null);
    form.reset();
    open();
  };

  return (
    <>
      <Paper p="md">
        <Title order={2} mb="lg">Navigation Sections Management</Title>
        
        <Alert icon={<MdInfo />} title="Navigation Sections" mb="lg">
          Create and manage navigation sections like Company, Shop, Help with their respective links.
        </Alert>

        <Group justify="space-between" mb="lg">
          <div></div>
          <Button leftSection={<MdAdd />} onClick={openNewSectionModal}>
            Add New Section
          </Button>
        </Group>

        {/* Existing Navigation Sections */}
        {footerData?.navigationSections && footerData.navigationSections.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {footerData.navigationSections
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((section: any, index: number) => (
                <Card key={section._id || index} withBorder p="md">
                  <Group justify="space-between" align="flex-start" mb="sm">
                    <div>
                      <Text fw={500} size="lg">{section.sectionTitle}</Text>
                      <Text size="sm" c="dimmed">
                        {section.links?.length || 0} links • Order: {section.order || 0}
                      </Text>
                    </div>
                    
                    <Group gap="sm">
                      <Switch
                        checked={section.isActive}
                        label={section.isActive ? "Active" : "Inactive"}
                        onChange={() => {
                          // Toggle section active status
                          const updatedSection = { ...section, isActive: !section.isActive };
                          handleEdit(updatedSection);
                        }}
                      />
                      <ActionIcon
                        variant="light"
                        onClick={() => handleEdit(section)}
                      >
                        <MdEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => handleRemove(section._id, section.sectionTitle)}
                      >
                        <MdDelete size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  
                  {section.links && section.links.length > 0 && (
                    <div style={{ marginLeft: '16px' }}>
                      {section.links
                        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                        .map((link: any, linkIndex: number) => (
                          <Group key={linkIndex} gap="sm" mb="xs">
                            <MdLink size={14} />
                            <Text size="sm" style={{ flex: 1 }}>
                              {link.title} → {link.url}
                            </Text>
                            <Text size="xs" c={link.isActive ? "green" : "red"}>
                              {link.isActive ? "Active" : "Inactive"}
                            </Text>
                          </Group>
                        ))}
                    </div>
                  )}
                </Card>
              ))}
          </div>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            No navigation sections created yet. Click "Add New Section" to get started.
          </Text>
        )}
      </Paper>

      {/* Modal for Adding/Editing Sections */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingSection ? "Edit Navigation Section" : "Add New Navigation Section"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Section Title"
                placeholder="e.g., COMPANY, SHOP, HELP"
                {...form.getInputProps('sectionTitle')}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={4}>
              <NumberInput
                label="Order"
                placeholder="1"
                min={1}
                {...form.getInputProps('order')}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Group justify="space-between" align="center" mb="sm">
                <Text fw={500}>Links</Text>
                <Button size="xs" variant="light" onClick={addNewLink} leftSection={<MdAdd size={14} />}>
                  Add Link
                </Button>
              </Group>
              
              {form.values.links.map((link, index) => (
                <Card key={index} withBorder p="sm" mb="sm">
                  <Grid>
                    <Grid.Col span={4}>
                      <TextInput
                        label="Link Title"
                        placeholder="About Us"
                        {...form.getInputProps(`links.${index}.title`)}
                        required
                      />
                    </Grid.Col>
                    
                    <Grid.Col span={4}>
                      <TextInput
                        label="URL"
                        placeholder="/about"
                        {...form.getInputProps(`links.${index}.url`)}
                        required
                      />
                    </Grid.Col>
                    
                    <Grid.Col span={2}>
                      <NumberInput
                        label="Order"
                        min={1}
                        {...form.getInputProps(`links.${index}.order`)}
                      />
                    </Grid.Col>
                    
                    <Grid.Col span={2}>
                      <div style={{ paddingTop: '25px' }}>
                        <Group gap="xs">
                          <Switch
                            {...form.getInputProps(`links.${index}.isActive`, { type: 'checkbox' })}
                            label="Active"
                            size="sm"
                          />
                          {form.values.links.length > 1 && (
                            <ActionIcon
                              color="red"
                              size="sm"
                              variant="light"
                              onClick={() => removeLink(index)}
                            >
                              <MdDelete size={14} />
                            </ActionIcon>
                          )}
                        </Group>
                      </div>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
            </Grid.Col>

            <Grid.Col span={12}>
              <Switch
                {...form.getInputProps('isActive', { type: 'checkbox' })}
                label="Section Active"
                description="When disabled, this entire section will be hidden from the footer"
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>Cancel</Button>
            <Button type="submit" loading={loading}>
              {editingSection ? 'Update Section' : 'Create Section'}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default NavigationSectionForm; 