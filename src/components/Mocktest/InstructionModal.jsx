import { Dialog, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material';

const InstructionModal = ({ open, onClose, onStart, testData }) => {
  if (!testData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Test Instructions</DialogTitle>
      <DialogContent>
        <Box my={2}>
          <Typography variant="h6" gutterBottom>
            {testData.testName}
          </Typography>
          
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Time Limit: {testData.timeLimit} minutes
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Total Questions: {testData.numberOfQuestions}
          </Typography>

          <Typography variant="body1" component="div" sx={{ mt: 2 }}>
            <strong>Important Instructions:</strong>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>The test will be conducted in full-screen mode</li>
              <li>Leaving full-screen mode will automatically submit your test</li>
              <li>Switching tabs or windows will end your test</li>
              <li>Ensure stable internet connection before starting</li>
              {testData.negativeMarking?.enabled && (
                <li>Negative marking: {testData.negativeMarking.value} marks</li>
              )}
              <li>Pass percentage required: {testData.passPercentage}%</li>
            </ul>
          </Typography>

          {testData.instructions && (
            <Typography variant="body1" sx={{ mt: 3 }}>
              <strong>Additional Instructions:</strong>
              <div className="mt-2">{testData.instructions}</div>
            </Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onStart} variant="contained" color="primary">
            Start Test
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionModal;
