import React, { useState, useRef } from "react"
import styled from "styled-components"

import useOnClickOutside from "../hooks/useOnClickOutside"
import { Icon, Popover } from "antd"

import { ReactComponent as Pencil } from "../assets/img/pencil.svg"
import { ReactComponent as Delete } from "../assets/img/delete.svg"

import { deleteCategory, deleteCategoryProducts } from "../store/actions"
import { connect } from "react-redux"

function has(object, key) {
  return object ? hasOwnProperty.call(object, key) : false
}

const PopUp = ({ categories, cat, deleteCategory, plus }) => {
  //find all category products that will be deleted
  let products = []
  function loop(tree, cat) {
    if (has(tree[cat], "children") && tree[cat].children) {
      tree[cat].children.map(key => {
        return loop(categories, key)
      })
    } else if (has(tree[cat], "products") && tree[cat].products) {
      products = products.concat(tree[cat].products)
    }
    return null
  }

  return (
    <PopContent
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {plus && (
        <p
          onClick={e => {
            console.log("alt clicked")
          }}
        >
          <Icon type="plus" /> Alt kateqoriya
        </p>
      )}

      <p
        onClick={e => {
          console.log("alt clicked")
        }}
      >
        <Icon component={Pencil} /> Redaktə et
      </p>
      <p
        style={{ margin: 0 }}
        onClick={e => {
          console.log("delete clicked for ", cat)
          loop(categories, cat)
          deleteCategory(cat, products)
        }}
      >
        <Icon component={Delete} /> Sil
      </p>
    </PopContent>
  )
}
const mapStateToProps = ({ categories }) => {
  return {
    categories
  }
}
const mapDispatch = dispatch => {
  return {
    deleteCategory: (cat, products) => {
      dispatch(deleteCategoryProducts(products))
      dispatch(deleteCategory(cat))
    }
  }
}
const ConnectedPopUp = connect(
  mapStateToProps,
  mapDispatch
)(PopUp)

export default function PopAndDots(props) {
  const [showDots, setShowDots] = useState(false)
  const ref = useRef()

  useOnClickOutside(ref, () => setShowDots(false))

  return (
    <Popover
      placement="leftTop"
      content={<ConnectedPopUp plus={props.plus} cat={props.cat} />}
      trigger="click"
    >
      <span
        ref={ref}
        style={{
          opacity: showDots ? 1 : 0,
          transform: showDots ? "scale(0.99)" : "scale(0)"
        }}
        onClick={event => {
          event.preventDefault()
          event.stopPropagation()
          setShowDots(showDots => !showDots)
          console.log(props.cat)
        }}
      >
        <Icon type="more" size="large" />
      </span>
    </Popover>
  )
}

const PopContent = styled.div`
  font-size: 12px;
  padding: 12px 16px;
  user-select: none;
  color: ${({ theme }) => theme.textBlack};
  path {
    fill: ${({ theme }) => theme.textBlack};
  }
  .anticon {
    font-size: 16px;
    padding-right: 4px;
    vertical-align: bottom;
  }
  p,
  p *,
  path {
    transition: all 0.1s ease-in-out;
  }
  p:hover,
  p:hover * {
    cursor: pointer;
    color: ${({ theme }) => theme.darkGreen};
    fill: ${({ theme }) => theme.darkGreen};
  }
`
