"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Card,
  Text,
  Button,
  Group,
  Badge,
  Modal,
  TextInput,
  Switch,
  NumberInput,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  deleteMarqueeText,
  updateMarqueeText,
} from "@/lib/database/actions/admin/marquee/marquee.actions";

const MarqueeListItem = ({
  marquee,
  setMarqueeTexts,
}: {
  marquee: any;
  setMarqueeTexts: any;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      text: marquee.text,
      isActive: marquee.isActive,
      order: marquee.order,
    },
    validate: {
      text: (value) =>
        value.length < 5 ? "Marquee text must be at least 5 characters." : null,
    },
  });

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this marquee text?")) {
      setLoading(true);
      try {
        const res = await deleteMarqueeText(marquee._id);
        if (res?.success) {
          setMarqueeTexts(res?.marqueeTexts);
          alert(res?.message);
        } else {
          alert(res?.message);
        }
      } catch (error) {
        alert("Error deleting marquee text");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const res = await updateMarqueeText(
        marquee._id,
        values.text,
        values.isActive,
        values.order
      );
      if (res?.success) {
        setMarqueeTexts(res?.marqueeTexts);
        alert(res?.message);
        close();
      } else {
        alert(res?.message);
      }
    } catch (error) {
      alert("Error updating marquee text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Box pos="relative">
          {loading && (
            <LoadingOverlay
              visible={loading}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          )}
          
          <Group justify="space-between" mb="xs">
            <Text fw={500} size="sm">
              Order: {marquee.order}
            </Text>
            <Badge color={marquee.isActive ? "green" : "red"} variant="light">
              {marquee.isActive ? "Active" : "Inactive"}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed" mb="md">
            {marquee.text}
          </Text>

          <Group justify="flex-end">
            <Button variant="light" size="xs" onClick={open}>
              Edit
            </Button>
            <Button variant="light" color="red" size="xs" onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        </Box>
      </Card>

      <Modal opened={opened} onClose={close} title="Edit Marquee Text" size="md">
        <form onSubmit={form.onSubmit(handleUpdate)}>
          <TextInput
            label="Marquee Text"
            placeholder="Enter marquee text"
            {...form.getInputProps("text")}
            mb="md"
          />

          <NumberInput
            label="Display Order"
            placeholder="Order of display (0 = first)"
            {...form.getInputProps("order")}
            mb="md"
          />

          <Switch
            label="Active"
            description="Toggle to show/hide this marquee text"
            {...form.getInputProps("isActive", { type: "checkbox" })}
            mb="md"
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default MarqueeListItem; 