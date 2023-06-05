package njt.paketnik

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import java.text.SimpleDateFormat
import java.util.Locale

class PackagersAdapter(context: Context, private val packagerList: List<PackagersActivity.Packager>) : ArrayAdapter<PackagersActivity.Packager>(context, R.layout.packager_item, packagerList) {
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
        holder.packagerNumber?.text = resources.getString(R.string.packagerNumber, packager.number.toString())

        if (packager.public) {
            holder.packagerVisibility?.setBackgroundResource(R.drawable.badge_success)
            holder.packagerVisibility?.text = resources.getString(R.string.packagerPublic)
            holder.packagerVisibility?.visibility = View.VISIBLE
            holder.packagerVisibility?.setTextColor(context.resources.getColor(R.color.badge_success_text_light, null))
        } else {
            holder.packagerVisibility?.setBackgroundResource(R.drawable.badge_neutral)
            holder.packagerVisibility?.text = resources.getString(R.string.packagerPrivate)
            holder.packagerVisibility?.visibility = View.VISIBLE
            holder.packagerVisibility?.setTextColor(context.resources.getColor(R.color.badge_neutral_text_light, null))
        }

        if (packager.active) {
            holder.packagerStatus?.setBackgroundResource(R.drawable.badge_success)
            holder.packagerStatus?.text = resources.getString(R.string.packagerActive)
            holder.packagerStatus?.visibility = View.VISIBLE
            holder.packagerStatus?.setTextColor(context.resources.getColor(R.color.badge_success_text_light, null))
        } else {
            holder.packagerStatus?.setBackgroundResource(R.drawable.badge_failed)
            holder.packagerStatus?.text = resources.getString(R.string.packagerInactive)
            holder.packagerStatus?.visibility = View.VISIBLE
            holder.packagerStatus?.setTextColor(context.resources.getColor(R.color.badge_failed_text_light, null))
        }

        //holder.packagerVisibility?.text = resources.getString(R.string.packagerVisibility, packager.public.toString())
        //holder.packagerStatus?.text = resources.getString(R.string.packagerStatus, packager.active.toString())

        return view!!
    }

    private class ViewHolder {
        var packagerNumber: TextView? = null
        var packagerVisibility: TextView? = null
        var packagerStatus: TextView? = null
    }
}