interface AddImportProp {
  from: string;
  name: string;
  content: string;
  parsed: ReturnType<typeof parse>;
  magicContent: MagicString.default;
}
