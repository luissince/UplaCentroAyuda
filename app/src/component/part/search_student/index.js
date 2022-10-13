import React, { useEffect,useRef } from "react";
import "../index.css";

const Index = (props) => {

    const index = useRef(-1);

    useEffect(() => {
        window.addEventListener("click", onEventWindowClick, false);

        return () => {
            window.removeEventListener("click", onEventWindowClick, false);
        }
    }, [])

    const onEventWindowClick = (event) => {
        let parent = document.getElementById("idDataResult");
        let click = event.target.parentElement.parentElement;

        if (parent == null) return;
        if (click == null) return;

        if (parent.isEqualNode(click)) {
        } else {
            if (parent != null) {
                props.onEventClearInput();
                index.current = -1;
            }
        }
    };

    const onEventKeyUp = (event) => {
        if (event.keyCode === 40 || event.which === 40) {
            if (props.filteredData.length === 0) return;

            const dataResult = document.getElementById("idDataResult");
            dataResult.focus();
            let children = dataResult.children;
            if (children.length > 0) {
                index.current = 0;
                children[index.current].focus();
            }
        } else if (event.keyCode === 13) {
            if (props.filteredData.length === 0) return;

            const dataResult = document.getElementById("idDataResult");
            dataResult.focus();
            let children = dataResult.children;
            if (children.length > 0) {
                index.current = 0;
                children[index.current].focus();
            }
        }
    }

    const onEventKeyDown = (event) => {
        if (event.keyCode === 38) {
            let children = document.getElementById("idDataResult").children;

            if (index.current !== 0) {
                if (index.current > 0) {
                    index.current--;
                    children[index.current].focus();
                }
            }
        } else if (event.keyCode === 40) {
            let children = document.getElementById("idDataResult").children;

            if (index.current < children.length - 1) {
                index.current++;
                children[index.current].focus();
            }
        }
    }


    return (
        <div className="search">
            <div className="form-group position-relative">
                <label className="control-label">Estudiante</label>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={props.placeholder}
                        ref={props.refStudent}
                        value={props.student}
                        onChange={props.handleFilter}
                        onKeyUp={(event) => onEventKeyUp(event)}
                    />
                    <div className="input-group-append">
                        <button
                            className="input-group-text"
                            type="button"
                            onClick={() => {
                                props.onEventClearInput();
                                props.refStudent.current.focus();
                                index.current = -1;
                            }}
                        >
                            <i className="fa fa-close"></i>
                        </button>
                    </div>
                </div>
                {props.filteredData.length !== 0 && (
                    <div
                        className="dataResult"
                        id="idDataResult"
                        tabIndex="-1"
                        onKeyDown={(event) => onEventKeyDown(event)}
                    >
                        {props.filteredData.map((value, index) => (
                            <button
                                key={index}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    props.onEventSelectItem(value);
                                    props.refStudent.current.focus();
                                    index = -1;
                                }}
                            >
                                {value.DatosPersonales}
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Index;
