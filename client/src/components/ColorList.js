import React, { useState } from "react";
import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [addColor, setAddColor] = useState(false);
  const [newColor, setNewColor] = useState({
    name: "",
    code: {
      hex: ''
    }
  });

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
    console.log(colorToEdit);
  };

  const addNewColor = () => {
    setAddColor(true);
  };

  const saveEdit = e => {
    // e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?

    axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(
        res => console.log(res)
        // colors.map(color => {
        //   console.log(color, 'color in map')
        //   if (color.id === res.data.id) {
        //     colors.splice(color, res.data)
        //   } else {
        //     return color;
        //   }
        // })
      )
      .catch(err => console.log(err));
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    console.log(color);
    axiosWithAuth()
      .delete(`http://localhost:5000/api/colors/${color.id}`)
      .then(res => updateColors(colors.filter(color => color.id !== res.data)))
      .catch(err => console.log(err));
  };

  const createColor = e => {
    e.preventDefault();
    axiosWithAuth()
      .post(`http://localhost:5000/api/colors`, newColor)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  const handleChange = e => {
    setNewColor({ ...newColor, [e.target.name]: e.target.value });
    console.log(newColor)
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      {colors.length === 0 && (
        <p>You Fool! There are no colors! Look what your hubris has wrought!</p>
      )}
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>

      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <button onClick={addNewColor}>Add Color</button>
      {/* <div className="spacer" /> */}
      {/* stretch - build another form here to add a color */}
      {addColor && (
        <form onSubmit={createColor}>
          <label>
            color name:
            <input
              type="text"
              name="name"
              value={newColor.name}
              onChange={handleChange}
            />
          </label>
          <label>
            hex code:
            <input
              type="text"
              name=''
              value={newColor.code.hex}
              onChange={handleChange}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setAddColor(false)}>cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ColorList;
