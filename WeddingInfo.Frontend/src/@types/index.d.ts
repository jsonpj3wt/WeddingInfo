// Global declaration of tinymce.
declare const tinymce: {
    // Best we can do since the authors of @types/tinymce decided to make their type definition file a module.
    init: (tinymce_Settings: any) => void;
    remove: (tinymce_Editor: any) => void;
};