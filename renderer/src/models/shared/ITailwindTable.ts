import { Icolumn, Irow } from "react-tailwind-table";

export type Irender_row = (
    row: Irow,
    col: Icolumn,
    display_value: any
) => JSX.Element | string;

export interface ItableStyle {
    base_bg_color?: string, //defaults to  bg-pink-700
    base_text_color?: string,//defaults to text-pink-700
    main?: string, //The container holding the table
    top?: {
        title?: string,
        elements?: { // The elements include the search, bulk select and csv download components
            main?: string, //The row holding these components
            search?: string,
            bulk_select?: {
                main?: string, // styling targets the dropdown
                button?: string
            },
            export?: string
        }
    },
    table_head?: {
        table_row?: string, // The <tr/> holding all <th/>
        table_data?: string // each table head column
    },
    table_body?: {
        main?: string, //main here targets <tbody/>
        table_row?: string,
        table_data?: string
    },
    footer?: {
        main?: string, // row holding the footer
        statistics?: { // those shiny numbers like **Showing 1 to 5 of 58 entries**
            main?: string,
            bold_numbers?: string //The numbers like 1, 5, 58
        },
        page_numbers?: string //the number boxes
    }
}