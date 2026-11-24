export type SectionLink = { label: string; href: `#${string}` };
export type EditorialImage = {
  base: string;
  alt: string;
  width: number;
  height: number;
};
export type Entry = { title: string; text: string };
export type Pathway = Entry & { focus: string; id: string };
export type ContactChannel = 'booking' | 'calendar' | 'whatsapp' | 'email';
export type Contacts = {
  mode: 'demo' | 'live';
  channels: Partial<Record<ContactChannel, string>>;
};
/** Objects of the Blender set tracked frame by frame (../3d/scripts/track_story.py). */
export type TrackedObject =
  | 'pear'
  | 'avocado'
  | 'orange'
  | 'stoneBase'
  | 'stoneMiddle'
  | 'stoneTop'
  | 'olive'
  | 'fig'
  | 'almonds';
/**
 * A caption attached to an object of the photograph, visible between two frames
 * of the sequence (1 = still life on the table, 96 = the finished sculpture).
 */
export type Annotation = {
  object: TrackedObject;
  text: string;
  from: number;
  to: number;
};
export type StoryChapter = {
  step: string;
  title: string;
  text: string;
  /** Frame of the sequence shown while the chapter is centred on screen. */
  frame: number;
  /** Side of the photograph that holds the text. */
  align: 'left' | 'right';
  /**
   * `free`: each caption sits beside its object. `column`: the captions line up on the side
   * opposite the text, like the legend of a plate (used while the objects form a tower).
   */
  captions: 'free' | 'column';
};
/** The nutritionist who tells the story. In the demo the identity is fictional. */
export type Professional = {
  name: string;
  firstName: string;
  role: string;
  /** Headline of the "Chi sono" section. */
  title: string;
  /** First-person biography, one paragraph per entry. */
  story: string[];
  quote: string;
  closing: string;
  qualifications: string[];
  photo: EditorialImage;
  photoCaption: string;
  /** Shown discreetly next to the name while the identity is a placeholder. */
  demoNote?: string;
};
