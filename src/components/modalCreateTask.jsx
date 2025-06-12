"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ModalCreateTask({ openModal, isOpen }) {

  const [open, setOpen] = React.useState(false);
  const [names, setNames] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [items, setItems] = React.useState([]);

  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;

    // Atualiza os items selecionados
    setItems(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );

    // Extrai os IDs das tags selecionadas
    const selectedTagIds = value.map(item => {
      // Extrai o ID da tag do elemento jsx
      return item[0].props.children[0].props.name;
    });

    // Atualiza o estado da tarefa com as tags selecionadas
    setTarefa(prev => ({
      ...prev,
      tags: selectedTagIds
    }));
  };

  // Cria a conexão
  const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {'Content-Type': 'application/json'}
  });

  const [tarefa, setTarefa] = useState({
      title: '',
      date: '',
      assignee: '',
      tags: [],
      completed: "p"
    });

  const [checkTags, setCheckTags] = useState([]);
  const [tags, setTags] = useState([]);

  const changeCheck = (e) => {
    const { name, checked } = e.target;

    let newCheckTags;
    if (checked) {
      newCheckTags = [...checkTags, name];
    } else {
      newCheckTags = checkTags.filter(tag => tag !== name);
    }
    
    setCheckTags(newCheckTags);
    // Chama renderTags com o novo array diretamente
    renderTags(newCheckTags);
  };

  const getTags = async () => {
    try {
      const response = await api.get('/viewTags');
      setTags(response.data);
      renderTags(checkTags, response.data);
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
    }
  };

  // Função separada para renderizar as tags
  const renderTags = (currentCheckTags = checkTags, currentTags = tags) => {
    // Função para verificar se a cor é clara
    const isLightColor = (hex) => {
      if (!hex || typeof hex !== "string") return false;
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      if (c.length !== 6) return false;
      const r = parseInt(c.substr(0,2),16);
      const g = parseInt(c.substr(2,2),16);
      const b = parseInt(c.substr(4,2),16);
      // Percepção de luminosidade
      const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
      return luminance > 0.7;
    };

    setNames(
      currentTags.map((tag) => (
        [<div key={tag.id} className={`w-fit rounded-md font-medium p-2 bg-[${tag.color}] ${isLightColor(tag.color) ? 'text-black' : 'text-white'}`} >
          <input type="checkbox" name={tag.id} id={tag.id} className="mr-2" onChange={e => changeCheck(e)} hidden/>
          <label htmlFor={tag.id} className='w-100 h-100 px-2 py-1 text-15'>{tag.name}</label>
        </div>]
      ))
    );
  };

  // UseEffect para renderizar as tags iniciais
  useEffect(() => {
    if (tags.length > 0) {
      renderTags();
    }
  }, [tags]);

  useEffect(() => {
    getTags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefa(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/addTask', tarefa)
    .then(response => {
        console.log('Tarefa adicionada com sucesso:', response.data);

        let idTarefa = response.data.insertId;
        api.post('/addTagsTasks', {tag_id: tarefa['tags'], task_id: idTarefa})
        .then(response => {
            console.log('Tag adicionada com sucesso:', response.data);
          })
          .catch(error => {
            console.error('Erro ao adicionar tag:', error);
          });
        // location.href = '/pages/frame/';
      })
      .catch(error => {
        console.error('Erro ao adicionar tarefa:', error);
      });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        event.target.id !== 'sidebar' &&
        event.target.id !== 'sidebar-icon' &&
        !event.target.closest('.sidebar-button')
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);
  
  useEffect(() => {
    openModal ? handleOpen() : "";
  }, [openModal])

  const closeModal = (event) => {
    let target = event.target;
    let insideBoxModal = false;
    while (target) {
      if (target.classList && (target.classList.contains("boxModal") || target.classList.contains("MuiModal-root"))) {
        insideBoxModal = true;
        break;
      }
      target = target.parentElement;
    }
    if (insideBoxModal) return;
    console.log("Fechou");
    isOpen();
    handleClose();
  }

  const closeModalForce = () => {
    isOpen();
    handleClose();
  }
  
  return (
    <div className="min-h-fit min-w-fit max-w-fit bg-[#111827] text-white">      
      {/* <Button onClick={handleOpen} className='w-fit h-fit'>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableScrollLock={true}
        onClick={(event) => {closeModal(event)}}
      >
        <Box className='boxModal absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] border-none focus:border-none' tabIndex="null">
          <main className="max-w-2xl mx-auto text-white">
            <div className="bg-[#1e293b] rounded-lg p-6 shadow-lg">
              <h1 className="text-2xl font-bold mb-6">Adicionar Nova Tarefa</h1>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="titulo" className="block text-sm font-medium mb-1">
                      Título da Tarefa
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={tarefa.title}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dataVencimento" className="block text-sm font-medium mb-1">
                        Data da Tarefa
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={tarefa.date}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        require
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="responsavel" className="block text-sm font-medium mb-1">
                        Responsável
                      </label>
                      <input
                        type="text"
                        id="assignee"
                        name="assignee"
                        value={tarefa.assignee}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome do responsável"
                        require
                      />
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium mb-1">
                        Selecione as Tags
                      </label>
                      <div className='flex flex-wrap gap-2 flex-row mt-3'>
                        <FormControl 
                          sx={{
                            m: 1,
                            width: 300,
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#fff', // cor da borda
                              },
                              '&:hover fieldset': {
                                borderColor: '#2563eb', // cor da borda ao passar o mouse
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6', // cor da borda quando focado
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#fff', // cor do label
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#3b82f6', // cor do label quando focado
                            },
                            '& .MuiSelect-select': {
                              color: '#fff', // cor do texto selecionado
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#fff', // cor do ícone da seta
                            },
                          }}>
                          <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={items}
                            onChange={handleChangeSelect}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.map(item => item[0].props.children[1].props.children).join(', ')}
                            MenuProps={MenuProps}
                          >
                            {names.map((name) => (
                              <MenuItem  value={name}>
                                <Checkbox checked={items.includes(name)} />
                                <ListItemText primary={name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <div onClick={() => {closeModalForce()}} className="px-4 py-2 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition">
                      Cancelar
                    </div>
                    <button className="px-4 py-2 rounded-md bg-blue-800 hover:bg-blue-700 cursor-pointer transition" onClick={handleSubmit}>
                      Adicionar Tarefa
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </Box>
      </Modal>
      
    </div>
  );
}