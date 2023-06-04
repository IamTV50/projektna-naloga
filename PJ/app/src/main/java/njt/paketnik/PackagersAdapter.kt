package njt.paketnik

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import java.text.SimpleDateFormat
import java.util.Locale

class PackagersAdapter(context: Context, private val packagerList: List<String>) : ArrayAdapter<String>(context, R.layout.packager_item, packagerList) {
    private val inflater: LayoutInflater = LayoutInflater.from(context)
    private val resources = context.resources

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var view = convertView
        val holder: ViewHolder

        if (view == null) {
            view = inflater.inflate(R.layout.packager_item, parent, false)
            holder = ViewHolder()
            holder.packagerNumber = view.findViewById(R.id.packagerNumber)
            holder.packagerVisibility = view.findViewById(R.id.packagerVisibility)
            holder.packagerStatus = view.findViewById(R.id.packagerStatus)
            view.tag = holder
        } else {
            holder = view.tag as ViewHolder
        }

        val packager = packagerList[position]
        holder.packagerNumber?.text = resources.getString(R.string.packagerNumber, packager)

        return view!!
    }

    private class ViewHolder {
        var packagerNumber: TextView? = null
        var packagerVisibility: TextView? = null
        var packagerStatus: TextView? = null
    }
}