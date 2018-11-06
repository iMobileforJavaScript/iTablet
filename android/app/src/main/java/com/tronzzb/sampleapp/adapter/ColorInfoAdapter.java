package com.tronzzb.sampleapp.adapter;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import com.supermap.itablet.R;

import java.util.ArrayList;


/** An array adapter that knows how to render views when given CustomData classes */
public class ColorInfoAdapter extends ArrayAdapter<ColorInfo> {

    private LayoutInflater mInflater;

    public ColorInfoAdapter(Context context, ArrayList<ColorInfo> values) {
        super(context, R.layout.custom_data_view, values);
        mInflater = (LayoutInflater) getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Holder holder;

        if (convertView == null) {
            // Inflate the view since it does not exist
            convertView = mInflater.inflate(R.layout.item_colorinfo_horizontallistview, parent, false);

            // Create and save off the holder in the tag so we get quick access to inner fields
            // This must be done for performance reasons
            holder = new Holder();
            holder.tv_bg = convertView.findViewById(R.id.tv_bg);
            holder.tv_select = convertView.findViewById(R.id.tv_select);
            convertView.setTag(holder);
        } else {
            holder = (Holder) convertView.getTag();
        }

        // Populate the text
        if (getItem(position) != null) {
            String color = getItem(position).getColor();
            holder.tv_bg.setBackgroundColor(Color.parseColor(color));

            if (getItem(position).isSelected()) {
                holder.tv_select.setVisibility(View.VISIBLE);
            } else {
                holder.tv_select.setVisibility(View.GONE);
            }
        }

        return convertView;
    }

    /** View holder for the views we need access to */
    private static class Holder {
        TextView tv_bg;
        TextView tv_select;
    }


}
