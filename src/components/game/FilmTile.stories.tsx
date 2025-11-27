import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilmTile } from "./FilmTile";
import type { Film } from "../../types";

const mockFilm: Film = {
  id: 1,
  title: "The Shawshank Redemption",
  year: 1994,
};

const meta: Meta<typeof FilmTile> = {
  title: "Game/FilmTile",
  component: FilmTile,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isSelected: { control: "boolean" },
    isShaking: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof FilmTile>;

export const Default: Story = {
  args: {
    film: mockFilm,
    isSelected: false,
    isShaking: false,
  },
};

export const Selected: Story = {
  args: {
    film: mockFilm,
    isSelected: true,
    isShaking: false,
  },
};

export const Shaking: Story = {
  args: {
    film: mockFilm,
    isSelected: true,
    isShaking: true,
  },
};

// Normal text: ≤12 characters (no special props)
export const NormalText: Story = {
  args: {
    film: {
      id: 2,
      title: "The Matrix", // 10 characters
      year: 1999,
    },
    isSelected: false,
    isShaking: false,
  },
};

// Long text: >12 and ≤20 characters (isLongText prop)
export const LongText: Story = {
  args: {
    film: {
      id: 3,
      title: "Jurassic Park", // 13 characters
      year: 1993,
    },
    isSelected: false,
    isShaking: false,
  },
};

// Really long text: >20 characters (isReallyLongText prop)
export const ReallyLongText: Story = {
  args: {
    film: {
      id: 4,
      title: "The Shawshank Redemption", // 24 characters
      year: 1994,
    },
    isSelected: false,
    isShaking: false,
  },
};

