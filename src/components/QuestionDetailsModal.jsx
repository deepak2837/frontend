import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export default function QuestionDetailsModal({ isOpen, onClose, question }) {
  if (!question) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: "90%",
          maxWidth: 500,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Question Details
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Question:</strong> {question.question}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Options:</strong>
        </Typography>
        <ul>
          {Object.entries(question.options || {}).map(([key, value]) => (
            <li key={key}>
              <Typography
                variant="body2"
                color={question.answer === key ? "primary" : "textSecondary"}
              >
                {key}. {value}
              </Typography>
            </li>
          ))}
        </ul>
        <Typography variant="body1" gutterBottom>
          <strong>Answer:</strong> {question.answer}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Explanation:</strong> {question.explanation}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
