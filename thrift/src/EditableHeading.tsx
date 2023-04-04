import { useEffect, useRef, useState } from "react";

import { FocusLock, Heading, Input, Textarea } from "@chakra-ui/react";
import styled from "styled-components";

type Size = "lg" | "md";

const StyledInput = styled(Textarea)`
  padding: 0;
  border: 0;
  font-weight: bold;
  ${({ ssize }: { ssize: Size }) => {
    let fontSize = "2em";
    let fontWeight = "2.5em";

    if (ssize === "md") {
      fontSize = "1em";
      fontWeight = "1.5em";
    }

    return `
      font-size: ${fontSize};
      height: ${fontWeight};
    `;
  }}
`;

const EditableHeading = ({
  defaultValue,
  onBlur,
  size: ssize = "lg",
}: {
  defaultValue: string;
  onBlur: (newValue: string) => void;
  size?: Size;
}) => {
  const [isEditing, setEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current!.focus();
    }
  }, [isEditing]);

  return (
    <FocusLock persistentFocus={false}>
      <Heading
        as="h2"
        size={ssize}
        display={isEditing ? "none" : ""}
        onClick={() => setEditing(true)}
      >
        {defaultValue}
      </Heading>
      <StyledInput
        type="text"
        ref={inputRef}
        ssize={ssize}
        display={isEditing ? "" : "none"}
        defaultValue={value}
        onBlur={({ target: { value } }) => {
          if (defaultValue !== value) {
            onBlur(value);
            setValue(value);
          }
          setEditing(false);
        }}
      />
    </FocusLock>
  );
};

export default EditableHeading;
