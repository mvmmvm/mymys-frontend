"use client";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
  Modal,
} 
from "@mui/material";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Story = {
  id: bigint
  name: string;
  set: string;
  body: string;
};


const StoryIndex = () => {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<bigint | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);

  const getRoom = async () => {
    try {
      const createStoryResponse = await axios.post('http://localhost:3000/stories');
      console.log(createStoryResponse.data.id)
      window.location.href = "/rooms/${createdRoomId}";
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const selectedStory = stories.find((story) => story.id === selectedStoryId);

  const handleShowDetails = (id?: bigint) => setSelectedStoryId(id || null);

  // const deleteBook = async (id: number) => {
  //   await axios.delete(`http://localhost:3000/books/${id}`); // 指定したBookを削除するRailsのAPIを叩いている
  //   setBooks(books.filter((book) => book.id !== id));
  // };

  return (
    <>
      
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AutoStoriesIcon />}
        onClick={() => getRoom()}
      >
        生成する！
      </Button>
      <TableContainer>
        <Table sx={{ maxWidth: 650 }} align="center">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Body</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories.map((story) => {
              return (
                <TableRow key={story.id}>
                  <TableCell>{story.name}</TableCell>
                  <TableCell>{story.set}</TableCell>
                  <TableCell>{story.body}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleShowDetails(story.id)}
                    >
                      SHOW
                    </Button>
                  </TableCell>
                  <TableCell>
                    {/* <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteForeverIcon />}
                      onClick={() => deleteBook(book.id)}
                    >
                      DESTROY
                    </Button> */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* {selectedStory && (
        <Modal open>
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "lightblue",
              p: 4,
              borderRadius: "0.5em",
            }}
          >
            <Box component="p">ID: {selectedStory.id}</Box>
            <Box component="p">Title: {selectedBook.title}</Box>
            <Box component="p">Body: {selectedBook.body}</Box>
            <Box component="p">CreatedAt: {selectedBook.created_at}</Box>
            <Box component="p">UpdatedAt: {selectedBook.updated_at}</Box>
            <Button onClick={() => handleShowDetails()} variant="contained">
              Close ✖️
            </Button>
          </Box>
        </Modal>
      )} */}
    </>
  );
};

export default StoryIndex;
