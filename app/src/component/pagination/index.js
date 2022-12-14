import React, { useRef } from "react";

const Index = (props) => {

    const upperPageBound = useRef(3);
    const lowerPageBound = useRef(0);
    const isPrevBtnActive = useRef("disabled");
    const isNextBtnActive = useRef("");
    const pageBound = useRef(3);

    const setPrevAndNextBtnClass = (listid) => {
        isNextBtnActive.current = "disabled";
        isPrevBtnActive.current = "disabled";

        if (
            props.totalPaginacion === listid &&
            props.totalPaginacion > 1
        ) {
            isPrevBtnActive.current = "";
        } else if (listid === 1 && props.totalPaginacion > 1) {
            isNextBtnActive.current = "";
        } else if (props.totalPaginacion > 1) {
            isNextBtnActive.current = "";
            isPrevBtnActive.current = "";
        }

        props.fillTable(listid);
    }

    const handleClick = (event) => {
        if (props.loading) return;

        let listid = parseInt(event.target.id);
        setPrevAndNextBtnClass(listid);
    }

    const btnPrevClick = () => {
        if (props.loading) return;

        if ((props.paginacion - 1) % pageBound.current === 0) {
            upperPageBound.current = upperPageBound.current - pageBound.current;
            lowerPageBound.current = lowerPageBound.current - pageBound.current;

        }
        let listid = props.paginacion - 1;
        setPrevAndNextBtnClass(listid);
    }

    const btnNextClick = () => {
        if (props.loading) return;

        if (props.paginacion + 1 > upperPageBound.current) {
            upperPageBound.current = upperPageBound.current + pageBound.current;
            lowerPageBound.current = lowerPageBound.current + pageBound.current;
        }
        let listid = props.paginacion + 1;
        setPrevAndNextBtnClass(listid);
    }

    const btnDecrementClick = () => {
        if (props.loading) return;

        upperPageBound.current = upperPageBound.current - pageBound.current;
        lowerPageBound.current = lowerPageBound.current - pageBound.current;
        let listid = upperPageBound.current;
        setPrevAndNextBtnClass(listid);
    }

    const btnIncrementClick = () => {
        if (props.loading) return;

        upperPageBound.current = upperPageBound.current + pageBound.current;
        lowerPageBound.current = lowerPageBound.current + pageBound.current;

        let listid = lowerPageBound.current + 1;
        setPrevAndNextBtnClass(listid);
    }

    if (props.restart) {
        upperPageBound.current = 3;
        lowerPageBound.current = 0;
        isPrevBtnActive.current = "disabled"
        isNextBtnActive.current = "";
        pageBound.current = 3;
    }

    const pageNumbers = [];
    for (let i = 1; i <= props.totalPaginacion; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map((number, index) => {
        if (number === 1 && props.paginacion === 1) {
            return (
                <li key={index} className="page-item active" aria-current="page">
                    <span className="page-link">{number}</span>
                </li>
            );
        } else if (
            number < upperPageBound.current + 1 &&
            number > lowerPageBound.current
        ) {
            return (
                <li
                    key={index}
                    className={`page-item ${number === props.paginacion ? "active" : ""}`}
                >
                    {number === props.paginacion ? (
                        <span id={number} className="page-link">
                            {number}
                        </span>
                    ) : (
                        <button
                            id={number}
                            className="page-link"
                            onClick={handleClick}
                        >
                            {number}
                        </button>
                    )}
                </li>
            );
        } else {
            return null;
        }
    });

    let pageDecrementBtn = null;
    if (lowerPageBound.current >= 1) {
        pageDecrementBtn = (
            <li className="page-item">
                <button className="page-link" onClick={btnDecrementClick}>
                    {" "}
                    &hellip;{" "}
                </button>
            </li>
        );
    }

    let pageIncrementBtn = null;
    if (pageNumbers.length > upperPageBound.current) {
        pageIncrementBtn = (
            <li className="page-item">
                <button className="page-link" onClick={btnIncrementClick}>
                    {" "}
                    &hellip;{" "}
                </button>
            </li>
        );
    }

    let renderPrevBtn = null;
    if (isPrevBtnActive.current === "disabled" ||
        props.totalPaginacion <= 1) {
        renderPrevBtn = (
            <li className="page-item disabled">
                <span className="page-link"> Ante. </span>
            </li>
        );
    } else {
        renderPrevBtn = (
            <li className="page-item">
                <button className="page-link" onClick={btnPrevClick}>
                    {" "}
                    Ante.{" "}
                </button>
            </li>
        );
    }

    let renderNextBtn = null;
    if (
        isNextBtnActive.current === "disabled" ||
        props.totalPaginacion <= 1
    ) {
        renderNextBtn = (
            <li className="page-item disabled">
                <span className="page-link"> Sigui. </span>
            </li>
        );
    } else {
        renderNextBtn = (
            <li className="page-item">
                <button className="page-link" onClick={btnNextClick}>
                    {" "}
                    Sigui.{" "}
                </button>
            </li>
        );
    }


    return (
        <>
            {renderPrevBtn}
            {pageDecrementBtn}
            {renderPageNumbers}
            {pageIncrementBtn}
            {renderNextBtn}
        </>
    );
}

export default Index;